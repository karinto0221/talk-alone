export type ResultShareImageData = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  highlightLabel: string;
  highlightValue: string;
  stats: readonly { label: string; value: string }[];
};

const WIDTH = 1200;
const HEIGHT = 630;

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function fitFontSize(context: CanvasRenderingContext2D, text: string, maxWidth: number, initialSize: number, minimumSize: number) {
  let size = initialSize;
  while (size > minimumSize) {
    context.font = `700 ${size}px Inter, "Noto Sans JP", sans-serif`;
    if (context.measureText(text).width <= maxWidth) return size;
    size -= 2;
  }
  return minimumSize;
}

export function createResultShareImage(data: ResultShareImageData): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) return Promise.reject(new Error('Canvas is not available'));

  const background = context.createLinearGradient(0, 0, WIDTH, HEIGHT);
  background.addColorStop(0, '#080d18');
  background.addColorStop(1, '#14223a');
  context.fillStyle = background;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  const glow = context.createRadialGradient(920, 80, 0, 920, 80, 560);
  glow.addColorStop(0, 'rgba(91, 140, 255, .24)');
  glow.addColorStop(1, 'rgba(91, 140, 255, 0)');
  context.fillStyle = glow;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  context.fillStyle = '#77a2ff';
  context.font = '700 17px ui-monospace, SFMono-Regular, Menlo, monospace';
  context.letterSpacing = '3px';
  context.fillText(data.eyebrow.toUpperCase(), 72, 72);
  context.letterSpacing = '0px';

  context.fillStyle = '#e6edf8';
  const titleSize = fitFontSize(context, data.title, 790, 52, 30);
  context.font = `700 ${titleSize}px Inter, "Noto Sans JP", sans-serif`;
  context.fillText(data.title, 72, 148, 790);

  if (data.subtitle) {
    context.fillStyle = '#8795aa';
    context.font = '500 22px Inter, "Noto Sans JP", sans-serif';
    context.fillText(data.subtitle, 74, 193, 790);
  }

  roundedRect(context, 875, 58, 253, 158, 18);
  context.fillStyle = 'rgba(14, 22, 37, .9)';
  context.fill();
  context.strokeStyle = '#30415d';
  context.lineWidth = 2;
  context.stroke();
  context.fillStyle = '#8795aa';
  context.font = '700 15px Inter, "Noto Sans JP", sans-serif';
  context.fillText(data.highlightLabel, 907, 101);
  context.fillStyle = '#e6edf8';
  context.font = '600 52px ui-monospace, SFMono-Regular, Menlo, monospace';
  context.fillText(data.highlightValue, 907, 169, 188);

  const stats = data.stats.slice(0, 4);
  const statsTop = 268;
  const statsWidth = 1056;
  const itemWidth = statsWidth / Math.max(1, stats.length);
  roundedRect(context, 72, statsTop, statsWidth, 178, 18);
  context.fillStyle = 'rgba(14, 22, 37, .82)';
  context.fill();
  context.strokeStyle = '#30415d';
  context.lineWidth = 2;
  context.stroke();

  stats.forEach((stat, index) => {
    const x = 72 + itemWidth * index;
    if (index > 0) {
      context.beginPath();
      context.moveTo(x, statsTop + 28);
      context.lineTo(x, statsTop + 150);
      context.strokeStyle = '#223047';
      context.lineWidth = 2;
      context.stroke();
    }
    context.fillStyle = '#5d6d84';
    context.font = '700 14px Inter, "Noto Sans JP", sans-serif';
    context.fillText(stat.label, x + 28, statsTop + 55, itemWidth - 56);
    context.fillStyle = '#dce5f2';
    const valueSize = fitFontSize(context, stat.value, itemWidth - 56, 29, 18);
    context.font = `600 ${valueSize}px Inter, "Noto Sans JP", sans-serif`;
    context.fillText(stat.value, x + 28, statsTop + 111, itemWidth - 56);
  });

  context.fillStyle = '#e6edf8';
  context.font = '700 27px Inter, sans-serif';
  context.fillText('talk-alone', 72, 546);
  context.fillStyle = '#5d6d84';
  context.font = '600 14px ui-monospace, SFMono-Regular, Menlo, monospace';
  context.letterSpacing = '2px';
  context.fillText('NO ACCOUNT · NO UPLOAD', 72, 578);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Could not create image')), 'image/png');
  });
}
