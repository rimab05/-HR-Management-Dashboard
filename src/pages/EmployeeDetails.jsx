import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, Building2, CalendarDays, Clock, Hash, Mail, Pencil, Phone, Trash2, UserX } from 'lucide-react';
import Avatar from '../components/common/Avatar.jsx';
import Button from '../components/common/Button.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Modal from '../components/common/Modal.jsx';
import Skeleton from '../components/common/Skeleton.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import EmployeeForm from '../components/employees/EmployeeForm.jsx';
import { useEmployees } from '../context/EmployeeContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { formatDate, getTenure } from '../utils/helpers.js';

function Detail({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
        <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className="text-xs font-semibold text-slate-500">{label}</dt>
        <dd className="break-words font-semibold text-slate-900">{children}</dd>
      </div>
    </div>
  );
}

export default function EmployeeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { employees, departmentMap, loading, updateEmployee, deleteEmployee } = useEmployees();
  const [editOpen, setEditOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const employee = employees.find((e) => e.id === id);

  const backLink = (
    <Link to="/employees" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline">
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      Back to employees
    </Link>
  );

  if (loading) {
    return (
      <div className="space-y-5">
        {backLink}
        <Skeleton className="h-40" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="space-y-5">
        {backLink}
        <div className="rounded-xl border border-slate-200 bg-white">
          <EmptyState
            tone="error"
            icon={UserX}
            title="Employee not found"
            message={`There is no employee with ID "${id}". They may have been deleted.`}
            action={<Button onClick={() => navigate('/employees')}>Go to employees</Button>}
          />
        </div>
      </div>
    );
  }

  const handleUpdate = (data) => {
    updateEmployee(employee.id, data);
    setEditOpen(false);
    toast.success(`${data.fullName} was updated.`);
  };

  const handleDelete = () => {
    deleteEmployee(employee.id);
    toast.success(`${employee.fullName} was deleted.`);
    navigate('/employees');
  };

  const department = departmentMap[employee.departmentId];

  return (
    <div className="space-y-5">
      {backLink}

      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">
          <Avatar name={employee.fullName} src={employee.profileImage} size="xl" />
          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              <h2 className="text-2xl font-extrabold text-slate-900">{employee.fullName}</h2>
              <StatusBadge status={employee.status} />
            </div>
            <p className="mt-1 text-slate-600">
              {employee.designation}
              {department && ` · ${department.name}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" icon={Pencil} onClick={() => setEditOpen(true)}>
              Edit
            </Button>
            <Button variant="danger" icon={Trash2} onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6" aria-labelledby="info">
        <h3 id="info" className="mb-5 font-extrabold text-slate-900">Employee information</h3>
        <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Detail icon={Hash} label="Employee ID">{employee.id}</Detail>
          <Detail icon={Mail} label="Email address">
            <a href={`mailto:${employee.email}`} className="text-brand-700 hover:underline">{employee.email}</a>
          </Detail>
          <Detail icon={Phone} label="Phone number">
            <a href={`tel:${employee.phone}`} className="text-brand-700 hover:underline">{employee.phone}</a>
          </Detail>
          <Detail icon={Building2} label="Department">{department?.name ?? 'Unassigned'}</Detail>
          <Detail icon={Briefcase} label="Designation">{employee.designation}</Detail>
          <Detail icon={CalendarDays} label="Joining date">{formatDate(employee.joiningDate)}</Detail>
          <Detail icon={Clock} label="Time with company">{getTenure(employee.joiningDate)}</Detail>
        </dl>
      </section>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit employee" description={`Update the details for ${employee.fullName}.`}>
        <EmployeeForm employee={employee} onSubmit={handleUpdate} onCancel={() => setEditOpen(false)} />
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete employee?"
        message={`${employee.fullName} (${employee.id}) will be permanently removed. This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
