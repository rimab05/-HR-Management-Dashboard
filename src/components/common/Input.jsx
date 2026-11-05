/**
 * Labelled form control. `as` can be "input" (default), "select" or "textarea".
 * Shows an inline error message and wires up aria attributes.
 */
export default function Input({
  label,
  id,
  as: Component = 'input',
  error,
  hint,
  required = false,
  className = '',
  children,
  ...props
}) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-red-600" aria-hidden="true">*</span>}
        </label>
      )}
      <Component
        id={id}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        className={`block w-full rounded-lg border bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 transition-colors read-only:bg-slate-50 read-only:text-slate-500 focus-visible:ring-offset-0 ${
          Component === 'textarea' ? 'py-2' : 'h-10'
        } ${error ? 'border-red-500 focus-visible:ring-red-400' : 'border-slate-300 hover:border-slate-400'}`}
        {...props}
      >
        {children}
      </Component>
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
