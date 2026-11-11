import type { RecordingResult } from '../../practice/hook/useAudioRecorder';

export function recordingExtension(mimeType: string): string {
  if (mimeType.includes('mp4')) return 'm4a';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('mpeg')) return 'mp3';
  if (mimeType.includes('wav')) return 'wav';
  return 'webm';
}

export async function saveRecording(recording: RecordingResult, fileName: string): Promise<boolean> {
  const url = URL.createObjectURL(recording.blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.hidden = true;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  return true;
}
