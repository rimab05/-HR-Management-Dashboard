export default function EmptyState({ icon: Icon, title, message, action, tone = 'neutral' }) {
  const iconTone = tone === 'error' ? 'bg-red-50 text-red-600' : 'bg-brand-50 text-brand-600';
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      {Icon && (
        <span className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${iconTone}`}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </span>
      )}
      <h3 className="text-base font-bold text-slate-900">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
