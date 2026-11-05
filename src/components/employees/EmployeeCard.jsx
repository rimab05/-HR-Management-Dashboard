import { Link } from 'react-router-dom';
import { Mail, Pencil, Phone, Trash2 } from 'lucide-react';
import Avatar from '../common/Avatar.jsx';
import Button from '../common/Button.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import { formatDate } from '../../utils/helpers.js';

/** Card layout for an employee. Used on mobile and for the grid view. */
export default function EmployeeCard({ employee, departmentName, onEdit, onDelete }) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <Link to={`/employees/${employee.id}`} className="flex min-w-0 items-center gap-3">
          <Avatar name={employee.fullName} src={employee.profileImage} size="lg" />
          <span className="min-w-0">
            <span className="block truncate font-bold text-slate-900 hover:text-brand-700">{employee.fullName}</span>
            <span className="block truncate text-sm text-slate-500">{employee.designation}</span>
          </span>
        </Link>
        <StatusBadge status={employee.status} />
      </div>

      <dl className="mt-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <dt className="sr-only">Email</dt>
          <dd className="truncate">{employee.email}</dd>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <dt className="sr-only">Phone</dt>
          <dd>{employee.phone}</dd>
        </div>
      </dl>

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="text-xs text-slate-500">
          <p className="font-semibold text-slate-700">{departmentName ?? 'Unassigned'}</p>
          <p>
            {employee.id} · Joined {formatDate(employee.joiningDate)}
          </p>
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" aria-label={`Edit ${employee.fullName}`} onClick={() => onEdit(employee)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete ${employee.fullName}`}
            className="hover:!bg-red-50 hover:!text-red-600"
            onClick={() => onDelete(employee)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
