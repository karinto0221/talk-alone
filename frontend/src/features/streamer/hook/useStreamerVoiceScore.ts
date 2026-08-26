import { useCallback, useEffect, useRef, useState } from 'react';

export type StreamerMicrophoneStatus = 'requesting' | 'active' | 'unavailable';

export type StreamerVoiceMetrics = {
  score: number;
  combo: number;
  isSpeaking: boolean;
  talkRatio: number;
  talkSeconds: number;
  currentStreakSeconds: number;
  longestStreakSeconds: number;
  longSilenceCount: number;
  longestSilenceSeconds: number;
  averageResponseSeconds: number | null;
  responseCount: number;
  volumeLevel: number;
};

export type StreamerScoreEvent = {
  id: number;
  label: string;
  points?: number;
  tone: 'good' | 'warning';
};

type Props = {
  active: boolean;
  completedNaturally: boolean;
  latestCommentId?: string;
  totalSeconds: number;
};

type InternalMetrics = StreamerVoiceMetrics & {
  rawScore: number;
  elapsedAudioSeconds: number;
  currentSilenceSeconds: number;
  responseTotalSeconds: number;
};

const LONG_SILENCE_SECONDS = 3;
const SPEECH_HOLD_MS = 220;
const SCORE_PER_TALK_SECOND = 12;
const MAX_COMBO = 3;

const initialMetrics = (): InternalMetrics => ({
  score: 0,
  rawScore: 0,
  combo: 1,
  isSpeaking: false,
  talkRatio: 0,
  talkSeconds: 0,
  elapsedAudioSeconds: 0,
  currentStreakSeconds: 0,
  longestStreakSeconds: 0,
  currentSilenceSeconds: 0,
  longSilenceCount: 0,
  longestSilenceSeconds: 0,
  averageResponseSeconds: null,
  responseTotalSeconds: 0,
  responseCount: 0,
  volumeLevel: 0,
});

function publicMetrics(metrics: InternalMetrics): StreamerVoiceMetrics {
  return {
    score: Math.round(metrics.rawScore),
    combo: metrics.combo,
    isSpeaking: metrics.isSpeaking,
    talkRatio: metrics.talkRatio,
    talkSeconds: metrics.talkSeconds,
    currentStreakSeconds: metrics.currentStreakSeconds,
    longestStreakSeconds: metrics.longestStreakSeconds,
    longSilenceCount: metrics.longSilenceCount,
    longestSilenceSeconds: metrics.longestSilenceSeconds,
    averageResponseSeconds: metrics.averageResponseSeconds,
    responseCount: metrics.responseCount,
    volumeLevel: metrics.volumeLevel,
  };
}

export function useStreamerVoiceScore({ active, completedNaturally, latestCommentId, totalSeconds }: Props) {
  const [microphoneStatus, setMicrophoneStatus] = useState<StreamerMicrophoneStatus>('requesting');
  const [metrics, setMetrics] = useState<StreamerVoiceMetrics>(() => publicMetrics(initialMetrics()));
  const [scoreEvent, setScoreEvent] = useState<StreamerScoreEvent | null>(null);
  const metricsRef = useRef(initialMetrics());
  const activeRef = useRef(active);
  const pendingResponseAtRef = useRef<number | null>(null);
  const stopRef = useRef<() => void>(() => undefined);
  const finalizedRef = useRef(false);
  const eventIdRef = useRef(0);

  const publishEvent = useCallback((label: string, tone: StreamerScoreEvent['tone'], points?: number) => {
    eventIdRef.current += 1;
    setScoreEvent({ id: eventIdRef.current, label, tone, points });
  }, []);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    if (!latestCommentId || microphoneStatus !== 'active' || !active) return;
    pendingResponseAtRef.current = performance.now();
  }, [active, latestCommentId, microphoneStatus]);

  useEffect(() => {
    if (!scoreEvent) return;
    const timer = window.setTimeout(() => {
      setScoreEvent((current) => current?.id === scoreEvent.id ? null : current);
    }, 2_200);
    return () => window.clearTimeout(timer);
  }, [scoreEvent]);

  useEffect(() => {
    let cancelled = false;
    let animationFrame = 0;
    let stream: MediaStream | null = null;
    let audioContext: AudioContext | null = null;

    const start = async () => {
      if (!navigator.mediaDevices?.getUserMedia || typeof AudioContext === 'undefined') {
        setMicrophoneStatus('unavailable');
        return;
      }

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        audioContext = new AudioContext();
        if (audioContext.state === 'suspended') await audioContext.resume();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 1024;
        analyser.smoothingTimeConstant = 0.55;
        source.connect(analyser);
        const samples = new Uint8Array(analyser.fftSize);
        let noiseFloor = 0.012;
        let speechHoldUntil = 0;
        let lastFrameAt = performance.now();
        let lastPublishedAt = 0;
        let longSilenceActive = false;
        let previousSpeaking = false;
        let announcedStreakLevel = 0;

        setMicrophoneStatus('active');

        const tick = (now: number) => {
          if (cancelled) return;
          const deltaSeconds = Math.min(0.1, Math.max(0, (now - lastFrameAt) / 1000));
          lastFrameAt = now;
          analyser.getByteTimeDomainData(samples);

          let squareTotal = 0;
          for (const sample of samples) {
            const normalized = (sample - 128) / 128;
            squareTotal += normalized * normalized;
          }
          const rms = Math.sqrt(squareTotal / samples.length);
          const threshold = Math.max(0.025, noiseFloor * 2.4);
          if (rms < threshold) noiseFloor = noiseFloor * 0.995 + rms * 0.005;
          if (rms >= threshold) speechHoldUntil = now + SPEECH_HOLD_MS;
          const speaking = now <= speechHoldUntil;
          const current = metricsRef.current;

          if (activeRef.current) {
            current.elapsedAudioSeconds += deltaSeconds;
            current.isSpeaking = speaking;
            current.volumeLevel = Math.min(100, Math.round((rms / 0.16) * 100));

            if (speaking) {
              if (!previousSpeaking && longSilenceActive) publishEvent('RECOVERY', 'good');
              longSilenceActive = false;
              current.talkSeconds += deltaSeconds;
              current.currentSilenceSeconds = 0;
              current.currentStreakSeconds += deltaSeconds;
              current.longestStreakSeconds = Math.max(current.longestStreakSeconds, current.currentStreakSeconds);
              const streakLevel = Math.floor(current.currentStreakSeconds / 15);
              current.combo = Math.min(MAX_COMBO, 1 + streakLevel * 0.25);
              current.rawScore += SCORE_PER_TALK_SECOND * current.combo * deltaSeconds;

              if (streakLevel > announcedStreakLevel && streakLevel > 0) {
                announcedStreakLevel = streakLevel;
                const bonus = streakLevel * 75;
                current.rawScore += bonus;
                publishEvent(`${streakLevel * 15} SEC STREAK`, 'good', bonus);
              }

              if (pendingResponseAtRef.current !== null) {
                const responseSeconds = Math.max(0, (now - pendingResponseAtRef.current) / 1000);
                pendingResponseAtRef.current = null;
                current.responseTotalSeconds += responseSeconds;
                current.responseCount += 1;
                current.averageResponseSeconds = current.responseTotalSeconds / current.responseCount;
                const bonus = Math.max(0, Math.round(600 - responseSeconds * 60));
                if (bonus > 0) {
                  current.rawScore += bonus;
                  publishEvent(responseSeconds <= 3 ? 'QUICK RESPONSE' : 'COMMENT PICKUP', 'good', bonus);
                }
              }
            } else {
              current.currentSilenceSeconds += deltaSeconds;
              current.longestSilenceSeconds = Math.max(current.longestSilenceSeconds, current.currentSilenceSeconds);
              if (current.currentSilenceSeconds < LONG_SILENCE_SECONDS) {
                current.currentStreakSeconds += deltaSeconds;
              } else if (!longSilenceActive) {
                longSilenceActive = true;
                current.longSilenceCount += 1;
                current.currentStreakSeconds = 0;
                current.combo = 1;
                announcedStreakLevel = 0;
                publishEvent('COMBO LOST', 'warning');
              }
            }

            current.talkRatio = current.elapsedAudioSeconds > 0
              ? (current.talkSeconds / current.elapsedAudioSeconds) * 100
              : 0;
            current.score = Math.round(current.rawScore);
          }

          previousSpeaking = speaking;
          if (now - lastPublishedAt >= 120) {
            lastPublishedAt = now;
            setMetrics(publicMetrics(current));
          }
          animationFrame = requestAnimationFrame(tick);
        };

        animationFrame = requestAnimationFrame(tick);
        stopRef.current = () => {
          cancelAnimationFrame(animationFrame);
          stream?.getTracks().forEach((track) => track.stop());
          void audioContext?.close();
        };
      } catch {
        stream?.getTracks().forEach((track) => track.stop());
        setMicrophoneStatus('unavailable');
      }
    };

    void start();
    return () => {
      cancelled = true;
      cancelAnimationFrame(animationFrame);
      stopRef.current();
    };
  }, [publishEvent]);

  useEffect(() => {
    if (active) return;
    if (!finalizedRef.current) {
      finalizedRef.current = true;
      const current = metricsRef.current;
      if (completedNaturally && microphoneStatus === 'active') {
        const bonus = Math.max(500, totalSeconds * 3);
        current.rawScore += bonus;
        publishEvent('SESSION COMPLETE', 'good', bonus);
      }
      current.score = Math.round(current.rawScore);
      setMetrics(publicMetrics(current));
    }
    stopRef.current();
  }, [active, completedNaturally, microphoneStatus, publishEvent, totalSeconds]);

  return { microphoneStatus, metrics, scoreEvent };
}
