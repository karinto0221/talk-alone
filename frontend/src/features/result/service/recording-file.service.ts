import { isTauri } from '@tauri-apps/api/core';
import { save } from '@tauri-apps/plugin-dialog';
import { writeFile } from '@tauri-apps/plugin-fs';
import type { RecordingResult } from '../../practice/hook/useAudioRecorder';

export function recordingExtension(mimeType: string): string {
  if (mimeType.includes('mp4')) return 'm4a';
  if (mimeType.includes('ogg')) return 'ogg';
  if (mimeType.includes('mpeg')) return 'mp3';
  if (mimeType.includes('wav')) return 'wav';
  return 'webm';
}

export async function saveRecording(recording: RecordingResult, fileName: string): Promise<boolean> {
  if (isTauri()) {
    const extension = recordingExtension(recording.mimeType);
    const path = await save({
      defaultPath: fileName,
      filters: [{ name: '音声ファイル', extensions: [extension] }],
    });
    if (!path) return false;
    await writeFile(path, new Uint8Array(await recording.blob.arrayBuffer()));
    return true;
  }

  const url = URL.createObjectURL(recording.blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
  return true;
}
