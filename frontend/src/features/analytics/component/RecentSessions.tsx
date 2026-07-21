import type { Speech } from '../../../api';
import { formatTime } from '../../practice/util/time';
import { EmptyState } from './MonthlyChart';

const formatDate = (date: string) => new Intl.DateTimeFormat('ja-JP', { month: '2-digit', day: '2-digit' }).format(new Date(date));

export function RecentSessions({ items }: { items: Speech[] }) {
  if (!items.length) return <EmptyState />;
  return <div className="sessions-table" role="table" aria-label="最近のスピーチ">
    <div className="table-row table-header" role="row"><span>日付</span><span>お題</span><span>ジャンル</span><span>時間</span></div>
    {items.slice(0, 8).map((item) => <div className="table-row" role="row" key={item.id}>
      <span>{formatDate(item.completedAt)}</span><strong>{item.topic}</strong><span>{item.categoryName}</span><b>{formatTime(item.durationSeconds)}</b>
    </div>)}
  </div>;
}
