import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { mockDepartments, mockEmployees } from '../data/mockEmployees.js';

const EmployeeContext = createContext(null);

const makeEmployeeId = (employees) => {
  const max = employees.reduce((acc, e) => {
    const n = parseInt(String(e.id).replace(/\D/g, ''), 10);
    return Number.isNaN(n) ? acc : Math.max(acc, n);
  }, 0);
  return `EMP-${String(max + 1).padStart(3, '0')}`;
};

export function EmployeeProvider({ children }) {
  const [employees, setEmployees, employeeError] = useLocalStorage('hr_employees', mockEmployees);
  const [departments, setDepartments, departmentError] = useLocalStorage('hr_departments', mockDepartments);
  const [loading, setLoading] = useState(true);
  const [dismissedError, setDismissedError] = useState(false);

  // Brief simulated load so loading states are visible and consistent.
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(timer);
  }, []);

  const nextEmployeeId = useMemo(() => makeEmployeeId(employees), [employees]);

  const departmentMap = useMemo(
    () => Object.fromEntries(departments.map((d) => [d.id, d])),
    [departments]
  );

  const employeeCountByDepartment = useMemo(() => {
    const counts = {};
    employees.forEach((e) => {
      counts[e.departmentId] = (counts[e.departmentId] || 0) + 1;
    });
    return counts;
  }, [employees]);

  const stats = useMemo(() => {
    const active = employees.filter((e) => e.status === 'Active').length;
    return { total: employees.length, active, inactive: employees.length - active };
  }, [employees]);

  /* ---------- employees ---------- */
  const addEmployee = useCallback(
    (data) => {
      const employee = { ...data, id: makeEmployeeId(employees), createdAt: Date.now() };
      setEmployees((prev) => [...prev, employee]);
      return employee;
    },
    [employees, setEmployees]
  );

  const updateEmployee = useCallback(
    (id, data) => {
      setEmployees((prev) => prev.map((e) => (e.id === id ? { ...e, ...data, id } : e)));
    },
    [setEmployees]
  );

  const deleteEmployee = useCallback(
    (id) => {
      setEmployees((prev) => prev.filter((e) => e.id !== id));
    },
    [setEmployees]
  );

  /* ---------- departments ---------- */
  const addDepartment = useCallback(
    (data) => {
      const department = { ...data, id: `dep-${Date.now().toString(36)}` };
      setDepartments((prev) => [...prev, department]);
      return department;
    },
    [setDepartments]
  );

  const updateDepartment = useCallback(
    (id, data) => {
      setDepartments((prev) => prev.map((d) => (d.id === id ? { ...d, ...data, id } : d)));
    },
    [setDepartments]
  );

  /** Departments that still have employees cannot be removed. */
  const deleteDepartment = useCallback(
    (id) => {
      const count = employeeCountByDepartment[id] || 0;
      if (count > 0) {
        return {
          ok: false,
          message: `Move or remove the ${count} employee${count > 1 ? 's' : ''} in this department first.`,
        };
      }
      setDepartments((prev) => prev.filter((d) => d.id !== id));
      return { ok: true };
    },
    [employeeCountByDepartment, setDepartments]
  );

  const resetData = useCallback(() => {
    setEmployees(mockEmployees);
    setDepartments(mockDepartments);
  }, [setEmployees, setDepartments]);

  const storageError = dismissedError ? null : employeeError || departmentError;

  const value = {
    employees,
    departments,
    departmentMap,
    employeeCountByDepartment,
    stats,
    loading,
    nextEmployeeId,
    storageError,
    dismissStorageError: () => setDismissedError(true),
    addEmployee,
    updateEmployee,
    deleteEmployee,
    addDepartment,
    updateDepartment,
    deleteDepartment,
    resetData,
  };

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
}

export function useEmployees() {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error('useEmployees must be used inside <EmployeeProvider>');
  return ctx;
}
