import { Link } from 'react-router-dom';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import Avatar from '../common/Avatar.jsx';
import Button from '../common/Button.jsx';
import StatusBadge from '../common/StatusBadge.jsx';
import { formatDate } from '../../utils/helpers.js';

export default function EmployeeTable({ employees, departmentMap, onEdit, onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-bold text-slate-500">
          <tr>
            <th scope="col" className="px-5 py-3">Employee</th>
            <th scope="col" className="px-3 py-3">Contact</th>
            <th scope="col" className="px-3 py-3">Department</th>
            <th scope="col" className="px-3 py-3">Joined</th>
            <th scope="col" className="px-3 py-3">Status</th>
            <th scope="col" className="px-5 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-slate-50/70">
              <td className="px-5 py-3">
                <Link to={`/employees/${emp.id}`} className="flex items-center gap-3">
                  <Avatar name={emp.fullName} src={emp.profileImage} />
                  <span>
                    <span className="block font-bold text-slate-900 hover:text-brand-700">{emp.fullName}</span>
                    <span className="block text-xs text-slate-500">
                      {emp.id} · {emp.designation}
                    </span>
                  </span>
                </Link>
              </td>
              <td className="px-3 py-3">
                <span className="block text-slate-700">{emp.email}</span>
                <span className="block text-xs text-slate-500">{emp.phone}</span>
              </td>
              <td className="px-3 py-3 text-slate-700">{departmentMap[emp.departmentId]?.name ?? 'Unassigned'}</td>
              <td className="whitespace-nowrap px-3 py-3 text-slate-700">{formatDate(emp.joiningDate)}</td>
              <td className="px-3 py-3">
                <StatusBadge status={emp.status} />
              </td>
              <td className="px-5 py-3">
                <div className="flex justify-end gap-1">
                  <Link
                    to={`/employees/${emp.id}`}
                    aria-label={`View ${emp.fullName}`}
                    title="View profile"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Button variant="ghost" size="icon" aria-label={`Edit ${emp.fullName}`} title="Edit" onClick={() => onEdit(emp)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${emp.fullName}`}
                    title="Delete"
                    className="hover:!bg-red-50 hover:!text-red-600"
                    onClick={() => onDelete(emp)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
