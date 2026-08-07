import type { SpeechAnalysis } from '../../../api';
import { useScoreRadar } from '../hook/useScoreRadar';

export function ScoreRadar({ score, breakdown }: { score: number; breakdown: SpeechAnalysis['scoreBreakdown'] }) {
  const radar = useScoreRadar(breakdown);

  return (
    <div className="score-section">
      <div className="score-visual">
        <div className="score-total" aria-label={`総合スコア ${score}点`}>
          <span>TOTAL SCORE</span>
          <div><strong>{score}</strong><small>/ 100</small></div>
        </div>
        <svg className="score-radar" viewBox="0 0 320 280" role="img" aria-label="5項目のスコアを示すレーダーチャート">
          <title>関連性、構成、具体性、一貫性、表現力の項目別スコア</title>
          {radar.gridPolygons.map((grid) => <polygon key={grid.ratio} className="radar-grid" points={grid.points} />)}
          {radar.dimensions.map((dimension) => (
            <g key={dimension.key}>
              <line className="radar-axis" x1={radar.center.x} y1={radar.center.y} x2={dimension.axisEnd.x} y2={dimension.axisEnd.y} />
              <text className="radar-label" x={dimension.labelPosition.x} y={dimension.labelPosition.y} textAnchor={dimension.textAnchor} dominantBaseline="middle">{dimension.label}</text>
            </g>
          ))}
          <polygon className="radar-data" points={radar.dataPolygon} />
          {radar.dimensions.map((dimension) => <circle key={dimension.key} className="radar-point" cx={dimension.dataPoint.x} cy={dimension.dataPoint.y} r="3.5" />)}
        </svg>
      </div>

      <div className="score-breakdown">
        {radar.dimensions.map((dimension) => (
          <div className="score-item" key={dimension.key}>
            <div className="score-item-copy"><strong>{dimension.label}</strong><span>{dimension.description}</span></div>
            <div className="score-item-value"><b>{dimension.score}</b><span>/ 20</span></div>
            <div className="score-item-track"><span style={{ width: `${dimension.progressPercent}%` }} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
