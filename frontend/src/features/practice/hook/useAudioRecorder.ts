import { useCallback, useEffect, useRef, useState } from 'react';

export type RecordingResult = { blob: Blob; mimeType: string };
export type RecordingStatus = 'idle' | 'recording' | 'unavailable';

const MIME_TYPES = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/webm', 'audio/ogg;codecs=opus'];

export function useAudioRecorder() {
  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const resultRef = useRef<RecordingResult | null>(null);
  const stopPromiseRef = useRef<Promise<RecordingResult | null> | null>(null);
  const [status, setStatus] = useState<RecordingStatus>('idle');

  const releaseStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(async () => {
    resultRef.current = null;
    stopPromiseRef.current = null;
    chunksRef.current = [];
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setStatus('unavailable');
      return false;
    }
    let stream: MediaStream | null = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = MIME_TYPES.find((type) => MediaRecorder.isTypeSupported(type));
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorderRef.current = recorder;
      recorder.start(1000);
      setStatus('recording');
      return true;
    } catch {
      stream?.getTracks().forEach((track) => track.stop());
      recorderRef.current = null;
      streamRef.current = null;
      setStatus('unavailable');
      return false;
    }
  }, []);

  const stop = useCallback((): Promise<RecordingResult | null> => {
    if (resultRef.current) return Promise.resolve(resultRef.current);
    if (stopPromiseRef.current) return stopPromiseRef.current;
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === 'inactive') {
      releaseStream();
      setStatus((current) => current === 'recording' ? 'idle' : current);
      return Promise.resolve(null);
    }
    stopPromiseRef.current = new Promise((resolve) => {
      recorder.onstop = () => {
        const mimeType = recorder.mimeType || chunksRef.current[0]?.type || 'audio/webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const result = blob.size > 0 ? { blob, mimeType } : null;
        resultRef.current = result;
        recorderRef.current = null;
        releaseStream();
        setStatus('idle');
        resolve(result);
      };
      recorder.stop();
    });
    return stopPromiseRef.current;
  }, [releaseStream]);

  useEffect(() => () => {
    const recorder = recorderRef.current;
    if (recorder?.state === 'recording') recorder.stop();
    releaseStream();
  }, [releaseStream]);

  return { status, start, stop };
}
