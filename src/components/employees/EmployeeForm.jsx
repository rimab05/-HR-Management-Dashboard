import { useRef, useState } from 'react';
import { ImagePlus, Trash2 } from 'lucide-react';
import Avatar from '../common/Avatar.jsx';
import Button from '../common/Button.jsx';
import Input from '../common/Input.jsx';
import { useEmployees } from '../../context/EmployeeContext.jsx';
import { fileToResizedDataUrl, todayISO } from '../../utils/helpers.js';
import { validateEmployee } from '../../utils/validation.js';

const emptyValues = {
  fullName: '',
  email: '',
  phone: '',
  profileImage: '',
  departmentId: '',
  designation: '',
  joiningDate: '',
  status: 'Active',
};

/**
 * Add / edit employee form. Pass `employee` to edit, omit it to create.
 * `onSubmit` receives the cleaned values; the parent decides what to do with them.
 */
export default function EmployeeForm({ employee, onSubmit, onCancel }) {
  const { employees, departments, nextEmployeeId } = useEmployees();
  const isEdit = Boolean(employee);

  const [values, setValues] = useState(() => (employee ? { ...emptyValues, ...employee } : emptyValues));
  const [errors, setErrors] = useState({});
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef(null);

  const validate = (vals) => validateEmployee(vals, employees, employee?.id ?? null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  // Validate a single field when the user leaves it.
  const handleBlur = (e) => {
    const { name } = e.target;
    const fieldError = validate(values)[name];
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    try {
      const dataUrl = await fileToResizedDataUrl(file);
      setValues((prev) => ({ ...prev, profileImage: dataUrl }));
      setErrors((prev) => ({ ...prev, profileImage: undefined }));
    } catch (err) {
      setUploadError(err.message);
    }
    e.target.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.values(found).some(Boolean)) {
      // jump to the first invalid field
      const first = Object.keys(found).find((k) => found[k]);
      document.getElementById(`emp-${first}`)?.focus();
      return;
    }
    onSubmit({
      ...values,
      fullName: values.fullName.trim(),
      email: values.email.trim(),
      phone: values.phone.trim(),
      designation: values.designation.trim(),
      profileImage: values.profileImage.trim(),
    });
  };

  const imageIsUrl = values.profileImage && !values.profileImage.startsWith('data:');

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* profile image */}
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Avatar key={values.profileImage} name={values.fullName || 'New Employee'} src={values.profileImage} size="lg" />
        <div className="space-y-1.5">
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" icon={ImagePlus} onClick={() => fileRef.current?.click()}>
              Upload photo
            </Button>
            {values.profileImage && (
              <Button size="sm" variant="ghost" icon={Trash2} onClick={() => setValues((p) => ({ ...p, profileImage: '' }))}>
                Remove
              </Button>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" aria-label="Upload profile photo" />
          <p className="text-xs text-slate-500">JPG or PNG. Resized automatically.</p>
          {uploadError && <p role="alert" className="text-xs font-medium text-red-600">{uploadError}</p>}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Employee ID" id="emp-id" value={isEdit ? employee.id : nextEmployeeId} readOnly hint="Assigned automatically." />
        <Input
          label="Status"
          id="emp-status"
          as="select"
          name="status"
          value={values.status}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.status}
          required
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </Input>

        <Input
          label="Full name"
          id="emp-fullName"
          name="fullName"
          value={values.fullName}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.fullName}
          placeholder="e.g. Anjali Kumari"
          required
          autoComplete="off"
        />
        <Input
          label="Email address"
          id="emp-email"
          name="email"
          type="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.email}
          placeholder="name@company.com"
          required
          autoComplete="off"
        />
        <Input
          label="Phone number"
          id="emp-phone"
          name="phone"
          type="tel"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.phone}
          placeholder="10-digit mobile number"
          required
        />
        <Input
          label="Joining date"
          id="emp-joiningDate"
          name="joiningDate"
          type="date"
          max={todayISO()}
          value={values.joiningDate}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.joiningDate}
          required
        />
        <Input
          label="Department"
          id="emp-departmentId"
          as="select"
          name="departmentId"
          value={values.departmentId}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.departmentId}
          hint={departments.length === 0 ? 'No departments yet. Add one from the Departments page.' : undefined}
          required
        >
          <option value="">Select department</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </Input>
        <Input
          label="Designation"
          id="emp-designation"
          name="designation"
          value={values.designation}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.designation}
          placeholder="e.g. Frontend Developer"
          required
        />
        <Input
          className="sm:col-span-2"
          label="Profile image link (optional)"
          id="emp-profileImage"
          name="profileImage"
          value={imageIsUrl ? values.profileImage : ''}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.profileImage}
          placeholder="https://…  — or use Upload photo above"
          disabled={Boolean(values.profileImage) && !imageIsUrl}
        />
      </div>

      <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">{isEdit ? 'Save changes' : 'Add employee'}</Button>
      </div>
    </form>
  );
}
