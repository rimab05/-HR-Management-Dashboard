import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Building2, LayoutDashboard, RotateCcw, Users, X } from 'lucide-react';
import ConfirmDialog from '../common/ConfirmDialog.jsx';
import { useEmployees } from '../../context/EmployeeContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/departments', label: 'Departments', icon: Building2 },
];

export default function Sidebar({ open, onClose }) {
  const { resetData } = useEmployees();
  const toast = useToast();
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    resetData();
    setConfirmReset(false);
    onClose();
    toast.success('Demo data restored.');
  };

  return (
    <>
      {/* mobile backdrop */}
      {open && <div className="fixed inset-0 z-30 bg-ink-900/50 lg:hidden" onClick={onClose} aria-hidden="true" />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink-900 text-slate-300 transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Sidebar"
      >
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <img src="/assets/logo.svg" alt="" className="h-9 w-9" />
            <div className="leading-tight">
              <p className="text-sm font-extrabold text-white">Tech Bihar</p>
              <p className="text-xs text-slate-400">People Hub</p>
            </div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close menu" className="rounded p-1 text-slate-400 hover:text-white lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-4 flex-1 space-y-1 px-3">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                  isActive ? 'bg-brand-600 text-white' : 'hover:bg-ink-700 hover:text-white'
                }`
              }
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-ink-700 p-3">
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 hover:bg-ink-700 hover:text-white"
          >
            <RotateCcw className="h-[18px] w-[18px]" aria-hidden="true" />
            Reset demo data
          </button>
        </div>
      </aside>

      <ConfirmDialog
        open={confirmReset}
        title="Reset demo data?"
        message="This replaces all employees and departments with the original sample data. Your changes will be lost."
        confirmLabel="Reset data"
        onConfirm={handleReset}
        onCancel={() => setConfirmReset(false)}
      />
    </>
  );
}
