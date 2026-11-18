export const CHALLENGE_VIDEO_WIDTH = 720;
export const CHALLENGE_VIDEO_HEIGHT = 1_280;

export type ChallengeVideoFrame = {
  language: 'ja' | 'en';
  title: string;
  promptLabel: string;
  prompt: string;
  round: number;
  totalRounds: number;
  remainingSeconds: number;
};

const wrapText = (context: CanvasRenderingContext2D, text: string, maxWidth: number) => {
  const tokens = /\s/.test(text) ? text.split(/(\s+)/).filter(Boolean) : Array.from(text);
  const lines: string[] = [];
  let line = '';
  tokens.forEach((token) => {
    const candidate = `${line}${token}`;
    if (line && context.measureText(candidate).width > maxWidth) {
      lines.push(line.trim());
      line = token.trimStart();
      return;
    }
    line = candidate;
  });
  if (line.trim()) lines.push(line.trim());
  return lines;
};

const roundedRect = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) => {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
};

export function drawChallengeVideoFrame(canvas: HTMLCanvasElement, frame: ChallengeVideoFrame) {
  const context = canvas.getContext('2d');
  if (!context) return;

  const width = CHALLENGE_VIDEO_WIDTH;
  const height = CHALLENGE_VIDEO_HEIGHT;
  context.clearRect(0, 0, width, height);

  const background = context.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, '#080d18');
  background.addColorStop(0.58, '#0c1525');
  background.addColorStop(1, '#111d31');
  context.fillStyle = background;
  context.fillRect(0, 0, width, height);

  context.fillStyle = 'rgba(91, 140, 255, 0.16)';
  context.beginPath();
  context.arc(650, 70, 230, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = 'rgba(56, 189, 248, 0.09)';
  context.beginPath();
  context.arc(45, 1_170, 260, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = '#e6edf8';
  context.font = '700 30px Inter, "Noto Sans JP", sans-serif';
  context.fillText('talk-alone', 56, 82);

  roundedRect(context, 548, 48, 116, 46, 23);
  context.fillStyle = 'rgba(239, 68, 68, 0.14)';
  context.fill();
  context.fillStyle = '#ef4444';
  context.beginPath();
  context.arc(574, 71, 7, 0, Math.PI * 2);
  context.fill();
  context.fillStyle = '#fca5a5';
  context.font = '700 18px ui-monospace, monospace';
  context.fillText('REC', 592, 78);

  context.fillStyle = '#77a2ff';
  context.font = '700 17px ui-monospace, monospace';
  context.fillText('QUICK RESPONSE CHALLENGE', 56, 162);
  context.fillStyle = '#e6edf8';
  context.font = '700 46px Inter, "Noto Sans JP", sans-serif';
  context.fillText(frame.title, 56, 225);

  context.fillStyle = '#8795aa';
  context.font = '600 18px ui-monospace, monospace';
  context.fillText(`ROUND ${String(frame.round).padStart(2, '0')} / ${String(frame.totalRounds).padStart(2, '0')}`, 56, 290);

  const timerValue = Math.max(0, frame.remainingSeconds);
  context.textAlign = 'right';
  context.fillStyle = timerValue <= 3 ? '#fca5a5' : '#dfe8f7';
  context.font = '600 58px ui-monospace, monospace';
  context.fillText(timerValue.toFixed(1), 664, 300);
  context.textAlign = 'left';

  roundedRect(context, 56, 338, 608, 610, 28);
  context.fillStyle = 'rgba(14, 22, 37, 0.96)';
  context.fill();
  context.strokeStyle = '#30415d';
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = '#38bdf8';
  context.font = '700 17px ui-monospace, monospace';
  context.fillText(frame.promptLabel.toUpperCase(), 92, 408);

  let fontSize = frame.prompt.length > 34 ? 44 : frame.prompt.length > 22 ? 52 : 60;
  let lines: string[] = [];
  do {
    context.font = `700 ${fontSize}px Inter, "Noto Sans JP", sans-serif`;
    lines = wrapText(context, frame.prompt, 520);
    fontSize -= 2;
  } while (lines.length > 5 && fontSize >= 34);

  const lineHeight = fontSize + 20;
  const blockHeight = lines.length * lineHeight;
  let lineY = 645 - blockHeight / 2;
  context.fillStyle = '#e1e9f5';
  context.textAlign = 'center';
  lines.slice(0, 5).forEach((line) => {
    context.fillText(line, width / 2, lineY);
    lineY += lineHeight;
  });
  context.textAlign = 'left';

  const progressWidth = 608 * Math.min(1, Math.max(0, timerValue / 10));
  roundedRect(context, 56, 988, 608, 8, 4);
  context.fillStyle = '#223047';
  context.fill();
  if (progressWidth > 0) {
    roundedRect(context, 56, 988, progressWidth, 8, 4);
    context.fillStyle = timerValue <= 3 ? '#f87171' : '#5b8cff';
    context.fill();
  }

  context.fillStyle = '#8795aa';
  context.font = '500 22px Inter, "Noto Sans JP", sans-serif';
  const instruction = frame.language === 'ja'
    ? '声に出して返し、終わったら「次へ」'
    : 'Answer out loud, then select Next';
  context.textAlign = 'center';
  context.fillText(instruction, width / 2, 1_070);

  context.fillStyle = '#5d6d84';
  context.font = '600 16px ui-monospace, monospace';
  context.fillText('5 PROMPTS · 10 SECONDS EACH', width / 2, 1_180);
  context.fillStyle = '#77a2ff';
  context.fillText('talk-alone', width / 2, 1_220);
  context.textAlign = 'left';
}

export const challengeVideoExtension = (mimeType: string) => mimeType.includes('mp4') ? 'mp4' : 'webm';
