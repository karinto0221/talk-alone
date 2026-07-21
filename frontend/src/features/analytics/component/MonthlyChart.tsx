import type { Analytics } from '../../../api';
import { formatTime } from '../../practice/util/time';

export function MonthlyChart({ items }: { items: Analytics['monthlyStats'] }) {
  const max = Math.max(180, ...items.map((item) => item.averageSeconds));
  if (!items.length) return <EmptyState />;
  return (
    <div className="monthly-chart" aria-label="月別平均スピーチ時間">
      {items.map((item) => <div className="month-column" key={item.month}>
        <span>{formatTime(item.averageSeconds)}</span>
        <div className="month-bar"><i style={{ height: `${Math.max(5, item.averageSeconds / max * 100)}%` }} /></div>
        <b>{item.month.replace(/^\d{4}-/, '')}月</b>
      </div>)}
    </div>
  );
}

export function EmptyState() {
  return <div className="empty-state"><p>記録がありません</p><span>スピーチを完了すると分析結果が表示されます。</span></div>;
}
