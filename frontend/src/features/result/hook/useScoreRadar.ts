import { useMemo } from 'react';
import type { SpeechAnalysis } from '../../../api';

type ScoreKey = keyof SpeechAnalysis['scoreBreakdown'];
type Position = { x: number; y: number };
type RadarDimension = {
  key: ScoreKey;
  label: string;
  description: string;
  score: number;
  progressPercent: number;
  axisEnd: Position;
  labelPosition: Position;
  textAnchor: 'start' | 'middle' | 'end';
  dataPoint: Position;
};

const DIMENSIONS: Array<{ key: ScoreKey; label: string; description: string }> = [
  { key: 'relevance', label: '関連性', description: 'お題に沿っているか' },
  { key: 'structure', label: '構成', description: '話が組み立てられているか' },
  { key: 'specificity', label: '具体性', description: '具体例や根拠があるか' },
  { key: 'coherence', label: '一貫性', description: '話につながりと展開があるか' },
  { key: 'expression', label: '表現力', description: '言葉選びが伝わりやすいか' },
];

const CENTER = { x: 160, y: 140 };
const RADIUS = 88;
const LABEL_RADIUS = 118;
const GRID_LEVELS = [0.25, 0.5, 0.75, 1];

function getPoint(index: number, ratio: number, radius = RADIUS): Position {
  const angle = -Math.PI / 2 + (Math.PI * 2 * index) / DIMENSIONS.length;
  return {
    x: CENTER.x + Math.cos(angle) * radius * ratio,
    y: CENTER.y + Math.sin(angle) * radius * ratio,
  };
}

function toPolygonPoints(points: Position[]) {
  return points.map(({ x, y }) => `${x},${y}`).join(' ');
}

function getTextAnchor(x: number): RadarDimension['textAnchor'] {
  if (x < CENTER.x - 12) return 'end';
  if (x > CENTER.x + 12) return 'start';
  return 'middle';
}

export function useScoreRadar(breakdown: SpeechAnalysis['scoreBreakdown']) {
  return useMemo(() => {
    const dimensions: RadarDimension[] = DIMENSIONS.map((dimension, index) => {
      const score = breakdown[dimension.key];
      const labelPosition = getPoint(index, 1, LABEL_RADIUS);
      return {
        ...dimension,
        score,
        progressPercent: score * 5,
        axisEnd: getPoint(index, 1),
        labelPosition,
        textAnchor: getTextAnchor(labelPosition.x),
        dataPoint: getPoint(index, score / 20),
      };
    });

    return {
      center: CENTER,
      gridPolygons: GRID_LEVELS.map((ratio) => ({ ratio, points: toPolygonPoints(DIMENSIONS.map((_, index) => getPoint(index, ratio))) })),
      dataPolygon: toPolygonPoints(dimensions.map(({ dataPoint }) => dataPoint)),
      dimensions,
    };
  }, [breakdown]);
}
