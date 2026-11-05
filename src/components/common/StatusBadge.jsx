const styles = {
  Active: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
  Inactive: 'bg-slate-100 text-slate-600 ring-slate-500/20',
};
const dots = { Active: 'bg-emerald-500', Inactive: 'bg-slate-400' };

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${
        styles[status] ?? styles.Inactive
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[status] ?? dots.Inactive}`} aria-hidden="true" />
      {status}
    </span>
  );
}
