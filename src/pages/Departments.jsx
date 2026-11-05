import { useState } from 'react';
import { Building2, Plus } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Modal from '../components/common/Modal.jsx';
import Skeleton from '../components/common/Skeleton.jsx';
import DepartmentCard from '../components/departments/DepartmentCard.jsx';
import DepartmentForm from '../components/departments/DepartmentForm.jsx';
import { useEmployees } from '../context/EmployeeContext.jsx';
import { useToast } from '../context/ToastContext.jsx';

export default function Departments() {
  const { departments, employeeCountByDepartment, loading, addDepartment, updateDepartment, deleteDepartment } = useEmployees();
  const toast = useToast();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (dep) => {
    setEditing(dep);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (data) => {
    if (editing) {
      updateDepartment(editing.id, data);
      toast.success(`${data.name} was updated.`);
    } else {
      addDepartment(data);
      toast.success(`${data.name} was added.`);
    }
    closeForm();
  };

  const handleDelete = () => {
    const result = deleteDepartment(deleting.id);
    if (result.ok) toast.success(`${deleting.name} was deleted.`);
    else toast.error(`Can't delete ${deleting.name}. ${result.message}`);
    setDeleting(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Departments</h2>
          <p className="text-sm text-slate-500">{loading ? 'Loading…' : `${departments.length} in total`}</p>
        </div>
        <Button icon={Plus} onClick={openAdd}>
          Add department
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => <Skeleton key={i} className="h-40" />)}
        </div>
      ) : departments.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <EmptyState
            icon={Building2}
            title="No departments yet"
            message="Create a department so employees can be assigned to it."
            action={<Button icon={Plus} onClick={openAdd}>Add department</Button>}
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {departments.map((dep) => (
            <DepartmentCard
              key={dep.id}
              department={dep}
              employeeCount={employeeCountByDepartment[dep.id] || 0}
              onEdit={openEdit}
              onDelete={setDeleting}
            />
          ))}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={closeForm}
        size="sm"
        title={editing ? 'Edit department' : 'Add department'}
        description={editing ? `Update details for ${editing.name}.` : 'Create a new team for your organisation.'}
      >
        <DepartmentForm department={editing} onSubmit={handleSubmit} onCancel={closeForm} />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete department?"
        message={deleting ? `${deleting.name} will be permanently removed. Departments that still have employees can't be deleted.` : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
