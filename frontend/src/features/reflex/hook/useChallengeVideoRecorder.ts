import { useCallback, useEffect, useRef, useState } from 'react';
import {
  CHALLENGE_VIDEO_HEIGHT,
  CHALLENGE_VIDEO_WIDTH,
  drawChallengeVideoFrame,
  type ChallengeVideoFrame,
} from '../util/challenge-video';

export type ChallengeVideoResult = { blob: Blob; mimeType: string };
export type ChallengeVideoStatus = 'idle' | 'preparing' | 'ready' | 'recording' | 'unavailable';

const VIDEO_MIME_TYPES = [
  'video/mp4;codecs=h264,aac',
  'video/mp4',
  'video/webm;codecs=vp9,opus',
  'video/webm;codecs=vp8,opus',
  'video/webm',
];

export function useChallengeVideoRecorder(frame: ChallengeVideoFrame) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef(frame);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const combinedStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const resultRef = useRef<ChallengeVideoResult | null>(null);
  const stopPromiseRef = useRef<Promise<ChallengeVideoResult | null> | null>(null);
  const preparePromiseRef = useRef<Promise<boolean> | null>(null);
  const skipMicrophoneRef = useRef<() => void>(() => undefined);
  const mountedRef = useRef(true);
  const [status, setStatus] = useState<ChallengeVideoStatus>('idle');
  const [hasMicrophoneAudio, setHasMicrophoneAudio] = useState(false);

  frameRef.current = frame;

  useEffect(() => {
    if (canvasRef.current) drawChallengeVideoFrame(canvasRef.current, frame);
  }, [frame]);

  const releaseStream = useCallback(() => {
    combinedStreamRef.current?.getTracks().forEach((track) => track.stop());
    combinedStreamRef.current = null;
  }, []);

  const prepareImpl = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || typeof MediaRecorder === 'undefined' || typeof canvas.captureStream !== 'function') {
      setStatus('unavailable');
      return false;
    }

    setStatus('preparing');
    drawChallengeVideoFrame(canvas, frameRef.current);
    const canvasStream = canvas.captureStream(15);
    const microphoneStream = await new Promise<MediaStream | null>((resolve) => {
      let settled = false;
      const finish = (stream: MediaStream | null) => {
        if (settled) {
          stream?.getTracks().forEach((track) => track.stop());
          return;
        }
        settled = true;
        skipMicrophoneRef.current = () => undefined;
        resolve(stream);
      };
      skipMicrophoneRef.current = () => finish(null);
      if (!navigator.mediaDevices?.getUserMedia) {
        finish(null);
        return;
      }
      void navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      }).then(finish).catch(() => finish(null));
    });

    if (!mountedRef.current) {
      canvasStream.getTracks().forEach((track) => track.stop());
      microphoneStream?.getTracks().forEach((track) => track.stop());
      return false;
    }

    const combinedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...(microphoneStream?.getAudioTracks() ?? []),
    ]);
    const mimeType = VIDEO_MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
    try {
      const recorder = new MediaRecorder(combinedStream, {
        ...(mimeType ? { mimeType } : {}),
        videoBitsPerSecond: 1_200_000,
        ...(microphoneStream ? { audioBitsPerSecond: 96_000 } : {}),
      });
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorderRef.current = recorder;
      combinedStreamRef.current = combinedStream;
      chunksRef.current = [];
      resultRef.current = null;
      stopPromiseRef.current = null;
      setHasMicrophoneAudio(Boolean(microphoneStream?.getAudioTracks().length));
      setStatus('ready');
      return true;
    } catch {
      combinedStream.getTracks().forEach((track) => track.stop());
      setStatus('unavailable');
      return false;
    }
  }, []);

  const prepare = useCallback(() => {
    if (!preparePromiseRef.current) preparePromiseRef.current = prepareImpl();
    return preparePromiseRef.current;
  }, [prepareImpl]);

  const skipMicrophone = useCallback(() => skipMicrophoneRef.current(), []);

  const start = useCallback(() => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state !== 'inactive') return false;
    chunksRef.current = [];
    recorder.start(1_000);
    setStatus('recording');
    return true;
  }, []);

  const stop = useCallback((): Promise<ChallengeVideoResult | null> => {
    if (resultRef.current) return Promise.resolve(resultRef.current);
    if (stopPromiseRef.current) return stopPromiseRef.current;
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      releaseStream();
      return Promise.resolve(null);
    }

    stopPromiseRef.current = new Promise((resolve) => {
      recorder.onstop = () => {
        const mimeType = recorder.mimeType || chunksRef.current[0]?.type || 'video/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const result = blob.size > 0 ? { blob, mimeType } : null;
        resultRef.current = result;
        recorderRef.current = null;
        releaseStream();
        if (mountedRef.current) setStatus(result ? 'idle' : 'unavailable');
        resolve(result);
      };
      recorder.stop();
    });
    return stopPromiseRef.current;
  }, [releaseStream]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      const recorder = recorderRef.current;
      if (recorder?.state === 'recording') recorder.stop();
      releaseStream();
    };
  }, [releaseStream]);

  return {
    canvasRef,
    canvasWidth: CHALLENGE_VIDEO_WIDTH,
    canvasHeight: CHALLENGE_VIDEO_HEIGHT,
    status,
    hasMicrophoneAudio,
    prepare,
    skipMicrophone,
    start,
    stop,
  };
}
