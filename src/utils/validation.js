import { todayISO } from './helpers.js';

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
// Indian mobile number: 10 digits starting 6-9, optional +91 / 0 prefix.
export const PHONE_REGEX = /^(?:\+91|91|0)?[6-9]\d{9}$/;

const normalizePhone = (phone) => phone.replace(/[\s-]/g, '');

export function validateEmployee(values, employees = [], editingId = null) {
  const errors = {};
  const name = values.fullName?.trim() ?? '';
  const email = values.email?.trim() ?? '';
  const phone = values.phone?.trim() ?? '';
  const designation = values.designation?.trim() ?? '';

  if (!name) errors.fullName = 'Full name is required.';
  else if (name.length < 2) errors.fullName = 'Full name must be at least 2 characters.';
  else if (!/^[\p{L}][\p{L}\s.'-]*$/u.test(name)) errors.fullName = 'Use letters, spaces, dots, hyphens or apostrophes only.';

  if (!email) errors.email = 'Email address is required.';
  else if (!EMAIL_REGEX.test(email)) errors.email = 'Enter a valid email address, like name@company.com.';
  else if (
    employees.some((e) => e.id !== editingId && e.email.trim().toLowerCase() === email.toLowerCase())
  ) {
    errors.email = 'An employee with this email already exists.';
  }

  if (!phone) errors.phone = 'Phone number is required.';
  else if (!PHONE_REGEX.test(normalizePhone(phone))) errors.phone = 'Enter a valid 10-digit mobile number (optionally with +91).';

  if (!values.departmentId) errors.departmentId = 'Choose a department.';

  if (!designation) errors.designation = 'Designation is required.';

  if (!values.joiningDate) errors.joiningDate = 'Joining date is required.';
  else if (values.joiningDate > todayISO()) errors.joiningDate = 'Joining date cannot be in the future.';

  if (!['Active', 'Inactive'].includes(values.status)) errors.status = 'Choose a status.';

  const img = values.profileImage?.trim() ?? '';
  if (img && !img.startsWith('data:image/') && !/^https?:\/\/\S+$/i.test(img)) {
    errors.profileImage = 'Image must be an uploaded file or a link starting with http(s)://';
  }

  return errors;
}

export function validateDepartment(values, departments = [], editingId = null) {
  const errors = {};
  const name = values.name?.trim() ?? '';

  if (!name) errors.name = 'Department name is required.';
  else if (name.length < 2) errors.name = 'Department name must be at least 2 characters.';
  else if (departments.some((d) => d.id !== editingId && d.name.trim().toLowerCase() === name.toLowerCase())) {
    errors.name = 'A department with this name already exists.';
  }

  if (values.head && values.head.trim().length > 0 && values.head.trim().length < 2) {
    errors.head = 'Department head must be at least 2 characters.';
  }

  if ((values.description ?? '').length > 200) errors.description = 'Description must be 200 characters or fewer.';

  return errors;
}
