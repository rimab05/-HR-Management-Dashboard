import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import EmptyState from '../components/common/EmptyState.jsx';

export default function NotFound() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white">
      <EmptyState
        tone="error"
        icon={Compass}
        title="Page not found"
        message="The page you are looking for doesn't exist or has moved."
        action={
          <Link to="/" className="inline-flex h-10 items-center rounded-lg bg-brand-600 px-4 text-sm font-semibold text-white hover:bg-brand-700">
            Back to dashboard
          </Link>
        }
      />
    </div>
  );
}
