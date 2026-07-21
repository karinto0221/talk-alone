import type { ReactNode } from 'react';

export function MetricCard({ label, value, detail, icon }: { label: string; value: string; detail: string; icon: ReactNode }) {
  return <article className="metric-card"><div className="metric-head"><span>{label}</span>{icon}</div><strong>{value}</strong><small>{detail}</small></article>;
}
