import { Link } from 'react-router-dom';
import { Pencil, Trash2, User, Users } from 'lucide-react';
import Button from '../common/Button.jsx';

export default function DepartmentCard({ department, employeeCount, onEdit, onDelete }) {
  return (
    <article className="flex flex-col rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-extrabold text-slate-900">{department.name}</h3>
        <div className="-mr-2 -mt-1.5 flex gap-1">
          <Button variant="ghost" size="icon" aria-label={`Edit ${department.name}`} title="Edit" onClick={() => onEdit(department)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label={`Delete ${department.name}`}
            title="Delete"
            className="hover:!bg-red-50 hover:!text-red-600"
            onClick={() => onDelete(department)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <p className="mt-1 flex-1 text-sm text-slate-500">{department.description || 'No description added.'}</p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-sm">
        <span className="flex items-center gap-1.5 text-slate-600">
          <User className="h-4 w-4 text-slate-400" aria-hidden="true" />
          {department.head || 'No head assigned'}
        </span>
        <Link
          to={`/employees?dept=${department.id}`}
          className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 font-bold text-brand-700 hover:bg-brand-100"
        >
          <Users className="h-4 w-4" aria-hidden="true" />
          {employeeCount} {employeeCount === 1 ? 'employee' : 'employees'}
        </Link>
      </div>
    </article>
  );
}
