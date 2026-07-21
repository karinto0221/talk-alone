import type { Analytics } from '../../../api';
import { formatTime } from '../../practice/util/time';
import { EmptyState } from './MonthlyChart';

export function CategoryBreakdown({ items }: { items: Analytics['categoryStats'] }) {
  if (!items.length) return <EmptyState />;
  return <div className="category-list">{items.map((item) => (
    <div className="category-item" key={item.categoryName}>
      <div><i style={{ background: item.color }} /><span>{item.categoryName}</span><small>{item.count}回</small></div>
      <div className="category-track"><span style={{ width: `${Math.min(100, item.averageSeconds / 180 * 100)}%`, background: item.color }} /></div>
      <strong>{formatTime(item.averageSeconds)}</strong>
    </div>
  ))}</div>;
}
