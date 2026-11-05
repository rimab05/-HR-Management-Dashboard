import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building2, UserCheck, UserMinus, UserPlus, Users } from 'lucide-react';
import Avatar from '../components/common/Avatar.jsx';
import Button from '../components/common/Button.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import Skeleton from '../components/common/Skeleton.jsx';
import StatusBadge from '../components/common/StatusBadge.jsx';
import { useEmployees } from '../context/EmployeeContext.jsx';
import { formatDate } from '../utils/helpers.js';

function StatCard({ label, value, icon: Icon, tone, loading }) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5">
      <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${tone}`}>
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        {loading ? <Skeleton className="mt-1 h-8 w-12" /> : <p className="text-3xl font-extrabold text-slate-900">{value}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { employees, departments, departmentMap, employeeCountByDepartment, stats, loading } = useEmployees();

  const recent = useMemo(
    () => [...employees].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0)).slice(0, 5),
    [employees]
  );

  const departmentStats = useMemo(() => {
    const rows = departments.map((d) => ({ ...d, count: employeeCountByDepartment[d.id] || 0 }));
    return rows.sort((a, b) => b.count - a.count);
  }, [departments, employeeCountByDepartment]);

  const maxCount = Math.max(1, ...departmentStats.map((d) => d.count));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-500">Here is where your workforce stands today.</p>
        </div>
        <Button icon={UserPlus} onClick={() => navigate('/employees', { state: { openAdd: true } })}>
          Add employee
        </Button>
      </div>

      <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total employees" value={stats.total} icon={Users} tone="bg-brand-50 text-brand-600" loading={loading} />
        <StatCard label="Active employees" value={stats.active} icon={UserCheck} tone="bg-emerald-50 text-emerald-600" loading={loading} />
        <StatCard label="Inactive employees" value={stats.inactive} icon={UserMinus} tone="bg-slate-100 text-slate-600" loading={loading} />
        <StatCard label="Departments" value={departments.length} icon={Building2} tone="bg-amber-50 text-amber-600" loading={loading} />
      </section>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* department-wise statistics */}
        <section className="rounded-xl border border-slate-200 bg-white lg:col-span-2" aria-labelledby="dept-stats">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 id="dept-stats" className="font-extrabold text-slate-900">Employees by department</h3>
            <Link to="/departments" className="text-sm font-semibold text-brand-700 hover:underline">
              Manage
            </Link>
          </div>
          <div className="p-5">
            {loading ? (
              <div className="space-y-4">
                {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-8" />)}
              </div>
            ) : departmentStats.length === 0 ? (
              <EmptyState icon={Building2} title="No departments yet" message="Add a department to see headcount here." />
            ) : (
              <ul className="space-y-4">
                {departmentStats.map((d) => (
                  <li key={d.id}>
                    <div className="mb-1.5 flex items-baseline justify-between text-sm">
                      <Link to={`/employees?dept=${d.id}`} className="font-semibold text-slate-700 hover:text-brand-700">
                        {d.name}
                      </Link>
                      <span className="font-bold text-slate-900">
                        {d.count}
                        <span className="ml-1 font-medium text-slate-400">
                          ({stats.total ? Math.round((d.count / stats.total) * 100) : 0}%)
                        </span>
                      </span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-slate-100" role="presentation">
                      <div className="h-full rounded-full bg-brand-500" style={{ width: `${(d.count / maxCount) * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* recently added */}
        <section className="rounded-xl border border-slate-200 bg-white lg:col-span-3" aria-labelledby="recent">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 id="recent" className="font-extrabold text-slate-900">Recently added</h3>
            <Link to="/employees" className="text-sm font-semibold text-brand-700 hover:underline">
              View all
            </Link>
          </div>
          {loading ? (
            <div className="space-y-4 p-5">
              {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : recent.length === 0 ? (
            <EmptyState icon={Users} title="No employees yet" message="Add your first employee to get started." />
          ) : (
            <ul className="divide-y divide-slate-100">
              {recent.map((emp) => (
                <li key={emp.id}>
                  <Link to={`/employees/${emp.id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50">
                    <Avatar name={emp.fullName} src={emp.profileImage} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-slate-900">{emp.fullName}</p>
                      <p className="truncate text-sm text-slate-500">
                        {emp.designation} · {departmentMap[emp.departmentId]?.name ?? 'Unassigned'}
                      </p>
                    </div>
                    <div className="hidden text-right sm:block">
                      <p className="text-xs text-slate-500">Joined {formatDate(emp.joiningDate)}</p>
                    </div>
                    <StatusBadge status={emp.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
