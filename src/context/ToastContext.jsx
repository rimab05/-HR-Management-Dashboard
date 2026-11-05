import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Toast from '../components/common/Toast.jsx';

const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const notify = useCallback((message, type = 'success') => {
    toastId += 1;
    setToasts((prev) => [...prev, { id: toastId, message, type }]);
  }, []);

  const api = useMemo(
    () => ({
      success: (m) => notify(m, 'success'),
      error: (m) => notify(m, 'error'),
      info: (m) => notify(m, 'info'),
    }),
    [notify]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:inset-x-auto sm:right-4 sm:items-end"
        aria-live="polite"
      >
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');
  return ctx;
}
