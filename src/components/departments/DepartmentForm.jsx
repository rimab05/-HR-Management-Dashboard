import { useState } from 'react';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import { useEmployees } from '../../context/EmployeeContext.jsx';
import { validateDepartment } from '../../utils/validation.js';

const emptyValues = { name: '', head: '', description: '' };

export default function DepartmentForm({ department, onSubmit, onCancel }) {
  const { departments } = useEmployees();
  const isEdit = Boolean(department);
  const [values, setValues] = useState(() => (department ? { ...emptyValues, ...department } : emptyValues));
  const [errors, setErrors] = useState({});

  const validate = (vals) => validateDepartment(vals, departments, department?.id ?? null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validate(values)[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      const first = Object.keys(found).find((k) => found[k]);
      document.getElementById(`dep-${first}`)?.focus();
      return;
    }
    onSubmit({ name: values.name.trim(), head: values.head.trim(), description: values.description.trim() });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <Input
        label="Department name"
        id="dep-name"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        placeholder="e.g. Customer Support"
        required
        autoComplete="off"
      />
      <Input
        label="Department head (optional)"
        id="dep-head"
        name="head"
        value={values.head}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.head}
        placeholder="e.g. Priya Singh"
        autoComplete="off"
      />
      <Input
        label="Description (optional)"
        id="dep-description"
        as="textarea"
        rows={3}
        name="description"
        value={values.description}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.description}
        hint={`${values.description.length}/200 characters`}
        placeholder="What does this team do?"
      />
      <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? 'Save changes' : 'Add department'}</Button>
      </div>
    </form>
  );
}
