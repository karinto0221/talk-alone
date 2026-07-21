import { Activity, Clock3, TimerReset } from 'lucide-react';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { CategoryBreakdown } from './component/CategoryBreakdown';
import { MetricCard } from './component/MetricCard';
import { MonthlyChart } from './component/MonthlyChart';
import { RecentSessions } from './component/RecentSessions';
import { useAnalytics } from './hook/useAnalytics';
import { formatTime } from '../practice/util/time';

export function AnalyticsFeature() {
  const { data, loading, error } = useAnalytics();
  if (loading && !data) return <main className="page centered-state"><LoadingSpinner label="分析データを読み込み中" /><span>分析データを読み込み中</span></main>;
  return (
    <main className="page analytics-page">
      <header className="page-heading"><div><p className="section-label">ANALYTICS</p><h1>スピーチ分析</h1></div><span>全期間</span></header>
      {error && <div className="error-banner" role="alert">{error}</div>}
      {data && <>
        <section className="metrics-grid">
          <MetricCard label="セッション" value={`${data.totalSessions}`} detail="完了回数" icon={<Activity size={18} />} />
          <MetricCard label="平均時間" value={formatTime(data.averageSeconds)} detail="全セッション" icon={<Clock3 size={18} />} />
          <MetricCard label="最長時間" value={formatTime(data.bestSeconds)} detail="ベスト記録" icon={<TimerReset size={18} />} />
        </section>
        <section className="analytics-grid">
          <article className="data-panel"><div className="panel-heading"><div><span>MONTHLY</span><h2>月別平均時間</h2></div></div><MonthlyChart items={data.monthlyStats} /></article>
          <article className="data-panel"><div className="panel-heading"><div><span>CATEGORY</span><h2>ジャンル別平均時間</h2></div></div><CategoryBreakdown items={data.categoryStats} /></article>
        </section>
        <section className="data-panel recent-panel"><div className="panel-heading"><div><span>RECENT</span><h2>最近のセッション</h2></div></div><RecentSessions items={data.recentSpeeches} /></section>
      </>}
    </main>
  );
}
