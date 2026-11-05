import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AlertCircle, X } from 'lucide-react';
import Sidebar from './Sidebar.jsx';
import Header from './Header.jsx';
import { useEmployees } from '../../context/EmployeeContext.jsx';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const { storageError, dismissStorageError } = useEmployees();

  // Close the mobile drawer and reset scroll on navigation.
  useEffect(() => {
    setSidebarOpen(false);
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {storageError && (
          <div role="alert" className="flex items-start gap-3 border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 sm:px-6 lg:px-8">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <p className="flex-1">{storageError}</p>
            <button type="button" onClick={dismissStorageError} aria-label="Dismiss warning">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
