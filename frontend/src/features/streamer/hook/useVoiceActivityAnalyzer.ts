import { useCallback, useEffect, useRef, useState } from 'react';

export type VoiceActivityStatus = 'preparing' | 'calibrating' | 'measuring' | 'unavailable';

export type VoiceActivityResult = {
  measuredMilliseconds: number;
  speakingMilliseconds: number;
  longestSpeechMilliseconds: number;
  longestSilenceMilliseconds: number;
  longPauseCount: number;
};

export type VoiceActivityInput = { stream: MediaStream; context: AudioContext };

type ActivityCounters = VoiceActivityResult & {
  currentSpeechMilliseconds: number;
  currentSilenceMilliseconds: number;
  pauseCounted: boolean;
};

const SAMPLE_INTERVAL_MS = 50;
const CALIBRATION_MS = 1_500;
const SPEECH_START_MS = 150;
const SPEECH_END_MS = 600;
const LONG_PAUSE_MS = 3_000;
const MICROPHONE_REQUEST_TIMEOUT_MS = 10_000;

const emptyCounters = (): ActivityCounters => ({
  measuredMilliseconds: 0,
  speakingMilliseconds: 0,
  longestSpeechMilliseconds: 0,
  longestSilenceMilliseconds: 0,
  longPauseCount: 0,
  currentSpeechMilliseconds: 0,
  currentSilenceMilliseconds: 0,
  pauseCounted: false,
});

const toResult = (counters: ActivityCounters): VoiceActivityResult => ({
  measuredMilliseconds: Math.round(counters.measuredMilliseconds),
  speakingMilliseconds: Math.round(counters.speakingMilliseconds),
  longestSpeechMilliseconds: Math.round(counters.longestSpeechMilliseconds),
  longestSilenceMilliseconds: Math.round(counters.longestSilenceMilliseconds),
  longPauseCount: counters.longPauseCount,
});

export function requestVoiceActivityInput(): Promise<VoiceActivityInput | null> {
  if (!navigator.mediaDevices?.getUserMedia || typeof AudioContext === 'undefined') return Promise.resolve(null);
  let context: AudioContext;
  try {
    context = new AudioContext();
    if (context.state === 'suspended') void context.resume().catch(() => undefined);
  } catch {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    let settled = false;
    const timeout = window.setTimeout(() => {
      settled = true;
      if (context.state !== 'closed') void context.close();
      resolve(null);
    }, MICROPHONE_REQUEST_TIMEOUT_MS);

    void navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
    }).then(async (stream) => {
      if (settled) {
        stream.getTracks().forEach((track) => track.stop());
        return;
      }
      try {
        if (context.state === 'suspended') await context.resume();
      } catch {
        stream.getTracks().forEach((track) => track.stop());
        if (context.state !== 'closed') void context.close();
        settled = true;
        window.clearTimeout(timeout);
        resolve(null);
        return;
      }
      settled = true;
      window.clearTimeout(timeout);
      resolve({ stream, context });
    }).catch(() => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      if (context.state !== 'closed') void context.close();
      resolve(null);
    });
  });
}

export function useVoiceActivityAnalyzer(inputPromise: Promise<VoiceActivityInput | null>) {
  const [status, setStatus] = useState<VoiceActivityStatus>('preparing');
  const statusRef = useRef<VoiceActivityStatus>('preparing');
  const streamRef = useRef<MediaStream | null>(null);
  const contextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number>();
  const countersRef = useRef<ActivityCounters>(emptyCounters());
  const finishedRef = useRef(false);
  const effectRunRef = useRef(0);
  const lastSampleAtRef = useRef(0);
  const isSpeakingRef = useRef(false);
  const aboveThresholdMsRef = useRef(0);
  const belowThresholdMsRef = useRef(0);

  const changeStatus = useCallback((nextStatus: VoiceActivityStatus) => {
    statusRef.current = nextStatus;
    setStatus(nextStatus);
  }, []);

  const stopResources = useCallback(() => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = undefined;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    const context = contextRef.current;
    contextRef.current = null;
    if (context && context.state !== 'closed') void context.close();
  }, []);

  const finish = useCallback((): VoiceActivityResult | null => {
    const result = statusRef.current === 'measuring' ? toResult(countersRef.current) : null;
    finishedRef.current = true;
    stopResources();
    return result;
  }, [stopResources]);

  useEffect(() => {
    const effectRun = effectRunRef.current + 1;
    effectRunRef.current = effectRun;
    finishedRef.current = false;
    let cancelled = false;

    void inputPromise.then((input) => {
      if (cancelled) {
        if (effectRunRef.current === effectRun) {
          input?.stream.getTracks().forEach((track) => track.stop());
          if (input?.context.state !== 'closed') void input?.context.close();
        }
        return;
      }
      if (finishedRef.current) {
        input?.stream.getTracks().forEach((track) => track.stop());
        if (input?.context.state !== 'closed') void input?.context.close();
        return;
      }
      if (!input) {
        changeStatus('unavailable');
        return;
      }

      try {
        const { stream, context } = input;

        const analyser = context.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.2;
        context.createMediaStreamSource(stream).connect(analyser);
        const samples = new Uint8Array(analyser.fftSize);
        const calibrationSamples: number[] = [];
        const calibrationStartedAt = performance.now();
        let speechThreshold = 0.025;
        let silenceThreshold = 0.018;

        streamRef.current = stream;
        contextRef.current = context;
        changeStatus('calibrating');

        const readVolume = () => {
          analyser.getByteTimeDomainData(samples);
          let sumSquares = 0;
          for (const sample of samples) {
            const normalized = (sample - 128) / 128;
            sumSquares += normalized * normalized;
          }
          return Math.sqrt(sumSquares / samples.length);
        };

        const measure = () => {
          const now = performance.now();
          const volume = readVolume();

          if (statusRef.current === 'calibrating') {
            calibrationSamples.push(volume);
            if (now - calibrationStartedAt < CALIBRATION_MS) return;
            const sorted = [...calibrationSamples].sort((left, right) => left - right);
            const noiseFloor = sorted[Math.floor(sorted.length * 0.2)] ?? 0;
            speechThreshold = Math.min(0.12, Math.max(0.018, noiseFloor * 2.5, noiseFloor + 0.012));
            silenceThreshold = Math.max(0.012, speechThreshold * 0.72);
            lastSampleAtRef.current = now;
            countersRef.current = emptyCounters();
            changeStatus('measuring');
            return;
          }

          if (statusRef.current !== 'measuring') return;
          const delta = Math.min(250, Math.max(0, now - lastSampleAtRef.current));
          lastSampleAtRef.current = now;

          if (isSpeakingRef.current) {
            belowThresholdMsRef.current = volume < silenceThreshold ? belowThresholdMsRef.current + delta : 0;
            if (belowThresholdMsRef.current >= SPEECH_END_MS) {
              isSpeakingRef.current = false;
              belowThresholdMsRef.current = 0;
              aboveThresholdMsRef.current = 0;
              countersRef.current.currentSilenceMilliseconds = 0;
              countersRef.current.pauseCounted = false;
            }
          } else {
            aboveThresholdMsRef.current = volume >= speechThreshold ? aboveThresholdMsRef.current + delta : 0;
            if (aboveThresholdMsRef.current >= SPEECH_START_MS) {
              isSpeakingRef.current = true;
              aboveThresholdMsRef.current = 0;
              belowThresholdMsRef.current = 0;
              countersRef.current.currentSpeechMilliseconds = 0;
            }
          }

          const counters = countersRef.current;
          counters.measuredMilliseconds += delta;
          if (isSpeakingRef.current) {
            counters.speakingMilliseconds += delta;
            counters.currentSpeechMilliseconds += delta;
            counters.currentSilenceMilliseconds = 0;
            counters.pauseCounted = false;
            counters.longestSpeechMilliseconds = Math.max(counters.longestSpeechMilliseconds, counters.currentSpeechMilliseconds);
          } else {
            counters.currentSilenceMilliseconds += delta;
            counters.currentSpeechMilliseconds = 0;
            counters.longestSilenceMilliseconds = Math.max(counters.longestSilenceMilliseconds, counters.currentSilenceMilliseconds);
            if (!counters.pauseCounted && counters.currentSilenceMilliseconds >= LONG_PAUSE_MS) {
              counters.longPauseCount += 1;
              counters.pauseCounted = true;
            }
          }
        };

        intervalRef.current = window.setInterval(measure, SAMPLE_INTERVAL_MS);
        measure();
      } catch {
        input.stream.getTracks().forEach((track) => track.stop());
        if (input.context.state !== 'closed') void input.context.close();
        changeStatus('unavailable');
      }
    });

    return () => {
      cancelled = true;
      window.setTimeout(() => {
        if (effectRunRef.current !== effectRun) return;
        finishedRef.current = true;
        stopResources();
      }, 0);
    };
  }, [changeStatus, inputPromise, stopResources]);

  return { status, finish };
}
