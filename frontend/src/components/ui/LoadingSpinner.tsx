export function LoadingSpinner({ label = '読み込み中' }: { label?: string }) {
  return <span className="spinner" role="status" aria-label={label} />;
}
