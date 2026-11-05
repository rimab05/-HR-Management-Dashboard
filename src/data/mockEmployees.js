export const mockDepartments = [
  { id: 'dep-eng', name: 'Engineering', head: 'Aarav Sinha', description: 'Builds and maintains our products and internal tools.' },
  { id: 'dep-hr', name: 'Human Resources', head: 'Neha Kumari', description: 'Hiring, onboarding, payroll and employee wellbeing.' },
  { id: 'dep-design', name: 'Design', head: 'Isha Verma', description: 'Product design, user research and brand.' },
  { id: 'dep-sales', name: 'Sales & Marketing', head: 'Rohit Raj', description: 'Client acquisition, campaigns and partnerships.' },
  { id: 'dep-fin', name: 'Finance', head: 'Priya Singh', description: 'Accounts, budgeting and compliance.' },
];

const DAY = 24 * 60 * 60 * 1000;
const now = Date.now();

const rows = [
  ['Aarav Sinha', 'aarav.sinha@techbihar.in', '9876543210', 'dep-eng', 'Engineering Manager', '2021-03-15', 'Active'],
  ['Neha Kumari', 'neha.kumari@techbihar.in', '9812345670', 'dep-hr', 'HR Lead', '2020-07-01', 'Active'],
  ['Isha Verma', 'isha.verma@techbihar.in', '9934567812', 'dep-design', 'Head of Design', '2021-11-22', 'Active'],
  ['Rohit Raj', 'rohit.raj@techbihar.in', '9709012345', 'dep-sales', 'Sales Director', '2019-09-09', 'Active'],
  ['Priya Singh', 'priya.singh@techbihar.in', '9631234567', 'dep-fin', 'Finance Controller', '2020-01-20', 'Active'],
  ['Vikash Kumar', 'vikash.kumar@techbihar.in', '9801122334', 'dep-eng', 'Senior React Developer', '2022-02-14', 'Active'],
  ['Ananya Jha', 'ananya.jha@techbihar.in', '9955667788', 'dep-eng', 'Frontend Developer', '2023-06-05', 'Active'],
  ['Saurabh Mishra', 'saurabh.mishra@techbihar.in', '9122334455', 'dep-eng', 'Backend Developer', '2022-10-10', 'Inactive'],
  ['Pooja Kumari', 'pooja.kumari@techbihar.in', '9031122445', 'dep-design', 'UI/UX Designer', '2023-01-30', 'Active'],
  ['Manish Prasad', 'manish.prasad@techbihar.in', '9798877665', 'dep-sales', 'Account Executive', '2023-08-18', 'Active'],
  ['Shreya Pandey', 'shreya.pandey@techbihar.in', '9886655443', 'dep-hr', 'Talent Acquisition Specialist', '2024-02-12', 'Active'],
  ['Deepak Yadav', 'deepak.yadav@techbihar.in', '9570011223', 'dep-fin', 'Accountant', '2022-05-23', 'Inactive'],
  ['Kajal Sharma', 'kajal.sharma@techbihar.in', '9661133557', 'dep-sales', 'Marketing Executive', '2024-04-01', 'Active'],
  ['Rahul Anand', 'rahul.anand@techbihar.in', '9939988776', 'dep-eng', 'QA Engineer', '2024-07-15', 'Active'],
];

export const mockEmployees = rows.map(
  ([fullName, email, phone, departmentId, designation, joiningDate, status], i) => ({
    id: `EMP-${String(i + 1).padStart(3, '0')}`,
    fullName,
    email,
    phone,
    profileImage: '',
    departmentId,
    designation,
    joiningDate,
    status,
    // staggered so "recently added" has a stable order
    createdAt: now - (rows.length - i) * DAY,
  })
);
