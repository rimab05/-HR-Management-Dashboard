import { useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Avatar from '../common/Avatar.jsx';

function getTitle(pathname) {
  if (pathname === '/') return 'Dashboard';
  if (pathname.startsWith('/employees/')) return 'Employee profile';
  if (pathname.startsWith('/employees')) return 'Employees';
  if (pathname.startsWith('/departments')) return 'Departments';
  return 'Page not found';
}

export default function Header({ onMenuClick }) {
  const { pathname } = useLocation();
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open menu"
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-lg font-extrabold text-slate-900">{getTitle(pathname)}</h1>
          <p className="hidden text-xs text-slate-500 sm:block">{today}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden text-right leading-tight sm:block">
          <p className="text-sm font-bold text-slate-900">HR Admin</p>
          <p className="text-xs text-slate-500">hr@techbiharinnovations.com</p>
        </div>
        <Avatar name="HR Admin" />
      </div>
    </header>
  );
}
