import { useEffect } from 'react';
import { CheckCircle2, Info, X, XCircle } from 'lucide-react';

const config = {
  success: { icon: CheckCircle2, style: 'border-emerald-200 text-emerald-800', iconStyle: 'text-emerald-500' },
  error: { icon: XCircle, style: 'border-red-200 text-red-800', iconStyle: 'text-red-500' },
  info: { icon: Info, style: 'border-sky-200 text-sky-800', iconStyle: 'text-sky-500' },
};

export default function Toast({ toast, onDismiss }) {
  const { icon: Icon, style, iconStyle } = config[toast.type] ?? config.info;

  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), 3800);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  return (
    <div
      role="status"
      className={`pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-white px-4 py-3 text-sm font-medium shadow-lg ${style}`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconStyle}`} aria-hidden="true" />
      <p className="flex-1">{toast.message}</p>
      <button type="button" onClick={() => onDismiss(toast.id)} aria-label="Dismiss notification" className="text-slate-400 hover:text-slate-600">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
