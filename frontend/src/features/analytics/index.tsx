import { useState } from 'react';
import { Activity, Clock3, TimerReset } from 'lucide-react';
import type { AnalyticsMode } from '../../api';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatTime } from '../practice/util/time';
import { CategoryBreakdown } from './component/CategoryBreakdown';
import { MetricCard } from './component/MetricCard';
import { MonthlyChart } from './component/MonthlyChart';
import { RecentSessions } from './component/RecentSessions';
import { useAnalytics } from './hook/useAnalytics';

const MODES: Array<{ id: AnalyticsMode; label: string }> = [
  { id: 'all', label: '総合' },
  { id: 'standard', label: 'スタンダード' },
  { id: 'word', label: 'ワード' },
];

export function AnalyticsFeature() {
  const [mode, setMode] = useState<AnalyticsMode>('all');
  const { data, loading, error } = useAnalytics(mode);
  if (loading && !data) return <main className="page centered-state"><LoadingSpinner label="分析データを読み込み中" /><span>分析データを読み込み中</span></main>;
  const detailLabel = mode === 'word' ? '選択またはランダムで決定したジャンル' : '選択したジャンル';

  return (
    <main className="page analytics-page">
      <header className="page-heading"><div><p className="section-label">ANALYTICS</p><h1>スピーチ分析</h1></div><span>全期間</span></header>
      <nav className="analytics-tabs" aria-label="分析モード">
        {MODES.map((item) => (
          <button key={item.id} type="button" className={mode === item.id ? 'active' : ''} aria-pressed={mode === item.id} onClick={() => setMode(item.id)}>{item.label}</button>
        ))}
      </nav>
      {error && <div className="error-banner" role="alert">{error}</div>}
      {data && <>
        <section className="metrics-grid">
          <MetricCard label="セッション" value={`${data.totalSessions}`} detail="完了回数" icon={<Activity size={18} />} />
          <MetricCard label="平均時間" value={formatTime(data.averageSeconds)} detail={mode === 'all' ? '全モード' : MODES.find((item) => item.id === mode)?.label ?? ''} icon={<Clock3 size={18} />} />
          <MetricCard label="最長時間" value={formatTime(data.bestSeconds)} detail="ベスト記録" icon={<TimerReset size={18} />} />
        </section>
        {mode === 'all' ? (
          <article className="data-panel overview-chart"><div className="panel-heading"><div><span>MONTHLY</span><h2>月別平均時間</h2></div></div><MonthlyChart items={data.monthlyStats} /></article>
        ) : (
          <>
            <section className="analytics-grid">
              <article className="data-panel"><div className="panel-heading"><div><span>MONTHLY</span><h2>月別平均時間</h2></div></div><MonthlyChart items={data.monthlyStats} /></article>
              <article className="data-panel"><div className="panel-heading"><div><span>CATEGORY</span><h2>ジャンル別平均時間</h2><small>{detailLabel}</small></div></div><CategoryBreakdown items={data.categoryStats} /></article>
            </section>
            <section className="data-panel recent-panel"><div className="panel-heading"><div><span>RECENT</span><h2>最近のセッション</h2></div></div><RecentSessions items={data.recentSpeeches} /></section>
          </>
        )}
      </>}
    </main>
  );
}
