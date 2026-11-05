import { useEffect, useMemo, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { LayoutGrid, List, SearchX, UserPlus, Users, X } from 'lucide-react';
import Button from '../components/common/Button.jsx';
import ConfirmDialog from '../components/common/ConfirmDialog.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Input from '../components/common/Input.jsx';
import Modal from '../components/common/Modal.jsx';
import SearchBar from '../components/common/SearchBar.jsx';
import { TableSkeleton } from '../components/common/Skeleton.jsx';
import EmployeeCard from '../components/employees/EmployeeCard.jsx';
import EmployeeForm from '../components/employees/EmployeeForm.jsx';
import EmployeeTable from '../components/employees/EmployeeTable.jsx';
import { useEmployees } from '../context/EmployeeContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import useDebounce from '../hooks/useDebounce.js';

const sorters = {
  'name-asc': (a, b) => a.fullName.localeCompare(b.fullName),
  'name-desc': (a, b) => b.fullName.localeCompare(a.fullName),
  'joined-new': (a, b) => b.joiningDate.localeCompare(a.joiningDate),
  'joined-old': (a, b) => a.joiningDate.localeCompare(b.joiningDate),
};

export default function Employees() {
  const { employees, departments, departmentMap, loading, addEmployee, updateEmployee, deleteEmployee } = useEmployees();
  const toast = useToast();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState(searchParams.get('dept') ?? 'all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name-asc');
  const [view, setView] = useState('table');

  const [formOpen, setFormOpen] = useState(Boolean(location.state?.openAdd));
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const debouncedSearch = useDebounce(search, 250);

  // Keep ?dept= in the URL in sync with the filter (so links from Departments work).
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (deptFilter === 'all') next.delete('dept');
    else next.set('dept', deptFilter);
    if (next.toString() !== searchParams.toString()) setSearchParams(next, { replace: true });
  }, [deptFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  // Clear router state so a refresh doesn't re-open the modal.
  useEffect(() => {
    if (location.state?.openAdd) window.history.replaceState({}, '');
  }, [location.state]);

  const filtered = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase();
    return employees
      .filter((e) => {
        const matchesSearch = !q || e.fullName.toLowerCase().includes(q) || e.email.toLowerCase().includes(q);
        const matchesDept = deptFilter === 'all' || e.departmentId === deptFilter;
        const matchesStatus = statusFilter === 'all' || e.status === statusFilter;
        return matchesSearch && matchesDept && matchesStatus;
      })
      .sort(sorters[sortBy]);
  }, [employees, debouncedSearch, deptFilter, statusFilter, sortBy]);

  const hasFilters = search || deptFilter !== 'all' || statusFilter !== 'all';
  const clearFilters = () => {
    setSearch('');
    setDeptFilter('all');
    setStatusFilter('all');
  };

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (emp) => {
    setEditing(emp);
    setFormOpen(true);
  };
  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSubmit = (data) => {
    if (editing) {
      updateEmployee(editing.id, data);
      toast.success(`${data.fullName} was updated.`);
    } else {
      const created = addEmployee(data);
      toast.success(`${created.fullName} was added as ${created.id}.`);
    }
    closeForm();
  };

  const handleDelete = () => {
    deleteEmployee(deleting.id);
    toast.success(`${deleting.fullName} was deleted.`);
    setDeleting(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Employees</h2>
          <p className="text-sm text-slate-500">{loading ? 'Loading…' : `${employees.length} in total`}</p>
        </div>
        <Button icon={UserPlus} onClick={openAdd}>
          Add employee
        </Button>
      </div>

      {/* search, filters and sorting */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or email" className="md:col-span-2 xl:col-span-1" />
          <Input id="filter-dept" as="select" aria-label="Filter by department" value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}>
            <option value="all">All departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </Input>
          <Input id="filter-status" as="select" aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Input>
          <Input id="sort" as="select" aria-label="Sort employees" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name-asc">Name: A to Z</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="joined-new">Joining date: newest</option>
            <option value="joined-old">Joining date: oldest</option>
          </Input>
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="text-slate-500" aria-live="polite">
            {loading ? '' : `Showing ${filtered.length} of ${employees.length}`}
          </p>
          <div className="flex items-center gap-2">
            {hasFilters && (
              <Button size="sm" variant="ghost" icon={X} onClick={clearFilters}>
                Clear filters
              </Button>
            )}
            <div className="hidden rounded-lg border border-slate-300 p-0.5 md:flex" role="group" aria-label="Layout">
              {[
                ['table', List, 'Table view'],
                ['grid', LayoutGrid, 'Card view'],
              ].map(([key, Icon, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-label={label}
                  aria-pressed={view === key}
                  title={label}
                  onClick={() => setView(key)}
                  className={`rounded-md p-1.5 ${view === key ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                  <Icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* results */}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <TableSkeleton />
        </div>
      ) : employees.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <EmptyState
            icon={Users}
            title="No employees yet"
            message="Add your first employee to start building your directory."
            action={<Button icon={UserPlus} onClick={openAdd}>Add employee</Button>}
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white">
          <EmptyState
            icon={SearchX}
            title="No matching employees"
            message="Try a different name or email, or clear the filters."
            action={<Button variant="secondary" onClick={clearFilters}>Clear filters</Button>}
          />
        </div>
      ) : (
        <>
          {view === 'table' && (
            <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white md:block">
              <EmployeeTable employees={filtered} departmentMap={departmentMap} onEdit={openEdit} onDelete={setDeleting} />
            </div>
          )}
          <div className={`grid gap-4 sm:grid-cols-2 xl:grid-cols-3 ${view === 'table' ? 'md:hidden' : ''}`}>
            {filtered.map((emp) => (
              <EmployeeCard
                key={emp.id}
                employee={emp}
                departmentName={departmentMap[emp.departmentId]?.name}
                onEdit={openEdit}
                onDelete={setDeleting}
              />
            ))}
          </div>
        </>
      )}

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editing ? 'Edit employee' : 'Add employee'}
        description={editing ? `Update the details for ${editing.fullName}.` : 'Fill in the details to add a new team member.'}
      >
        <EmployeeForm employee={editing} onSubmit={handleSubmit} onCancel={closeForm} />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete employee?"
        message={deleting ? `${deleting.fullName} (${deleting.id}) will be permanently removed. This cannot be undone.` : ''}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
      />
    </div>
  );
}
