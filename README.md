# HR Management Dashboard

A responsive HR admin dashboard for managing employees and departments, built for the
Tech Bihar Innovations frontend technical round. It runs entirely in the browser: all data is
stored in `localStorage` and seeded with mock records on first load.

**Stack:** React 18 · Vite · JavaScript (functional components) · React Router DOM v6 · Tailwind CSS 3 · Lucide React

## Setup

Requires Node.js 18 or newer.

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts: `npm run build` (production build) and `npm run preview` (serve the build).

## Features

**Dashboard**
- Total, active and inactive employee counts, plus the number of departments
- Department-wise headcount with share bars (each links to that department's employees)
- Five most recently added employees

**Employees**
- Table on desktop, cards on mobile, with a table/card toggle on larger screens
- Add, edit, delete and view individual profiles (ID, name, email, phone, photo, department, designation, joining date, status)
- Profile photo by upload (resized and stored as a small data URL) or by image link, with an initials fallback
- Search by name or email (debounced), filter by department and status, sort by name or joining date

**Departments**
- Add, edit and delete departments, each with an employee count
- A department that still has employees can't be deleted (an error toast explains why)
- "N employees" links to the Employees page pre-filtered by that department

**Validation** (inline messages, checked on blur and on submit)
- Required fields, email format, phone number (10-digit Indian mobile, optional +91)
- Duplicate email prevention (case-insensitive; ignores the employee being edited)
- Joining date can't be in the future; department names must be unique

**UX**
- Sidebar navigation (slide-in drawer on mobile), loading skeletons, empty states, error states (unknown employee, 404, storage problems)
- Confirmation dialog before every delete, toast notifications after every action
- "Reset demo data" in the sidebar restores the sample records

## Project structure

```
src/
├── components/
│   ├── common/        Button, Input, Modal, ConfirmDialog, SearchBar, StatusBadge,
│   │                  Avatar, Toast, EmptyState, Skeleton
│   ├── layout/        Sidebar, Header, MainLayout
│   ├── employees/     EmployeeTable, EmployeeCard, EmployeeForm
│   └── departments/   DepartmentCard, DepartmentForm
├── pages/             Dashboard, Employees, EmployeeDetails, Departments, NotFound
├── context/           EmployeeContext (data + CRUD), ToastContext
├── hooks/             useLocalStorage, useDebounce
├── data/              mockEmployees.js (seed employees and departments)
├── utils/             validation.js, helpers.js
├── App.jsx            routes
└── main.jsx           providers + entry
```

## Design notes

- **State:** `EmployeeContext` owns employees and departments and exposes the CRUD functions; pages and forms only call those. Derived data (filtered list, counts, stats) is computed with `useMemo`.
- **Persistence:** `useLocalStorage` wraps `useState` and writes on every change. Keys: `hr_employees`, `hr_departments`. Corrupted or unavailable storage shows a warning banner instead of crashing.
- **Relations:** employees reference a department by `departmentId`, so renaming a department updates everywhere automatically.
- **Reuse:** the same `EmployeeForm`, `Modal` and `ConfirmDialog` serve the list page and the profile page.

## Screenshots

See the `screenshots/` folder.
