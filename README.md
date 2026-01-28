## EmployeeEase Frontend – Demo Setup & Usage

This project is the **EmployeeEase** frontend, a React + Vite + MUI application with role-based dashboards and HR modules (attendance, performance evaluation, recruitment, payroll, and more).

For demo purposes it includes **frontend-only login accounts** that work **without any backend or database running**. This is ideal for client demos and product walkthroughs.

---

## 1. Tech Stack

- **Framework**: React (Vite)
- **UI Library**: Material UI (MUI)
- **Routing**: `react-router-dom`
- **State/Auth**: Custom JWT auth context
- **HTTP Client**: Axios

---

## 2. Running the Project

### Requirements

- **Node.js**: `16.x` or `18.x` (recommended)

### Using Yarn (recommended)

```bash
yarn install
yarn dev
```

### Using npm

```bash
npm install        # or: npm install --legacy-peer-deps
npm run dev
```

The app will start on the Vite dev server (by default `http://localhost:5173` unless you changed it).

---

## 3. Demo Logins (No Backend Required)

These accounts **do not call any backend API**. All authentication is handled in the frontend via a mock JWT token created in `src/auth/context/jwt/auth-provider.jsx`. You can use them even if the API server is offline.

- **Super Admin (all system-level setup + HRMS payment)**
  - Email: `demo@gmail.com`
  - Password: `123456`
  - Role: `sa`

- **Company Admin (company-focused dashboards & modules)**
  - Email: `company@gmail.com`
  - Password: `123456`
  - Role: `co`

- **Employee (HR/employee role with broad access)**
  - Email: `user@gmail.com`
  - Password: `123456`
  - Role: `cj`

- **Employee (additional demo user, same role as above)**
  - Email: `employee@gmail.com`
  - Password: `123456`
  - Role: `cj`

All these demo accounts:

- Bypass real login APIs (no backend calls)
- Create a mock JWT token with `username`, `role`, and expiry
- Store the token and basic user info in `localStorage` / `sessionStorage`
- Set a demo flag to **show all sidebar modules**, even if normally restricted by role

---

## 4. Roles & Key Modules

Navigation is configured in `src/layouts/dashboard/config-navigation.jsx` and uses both:

- `sessionStorage.userType` (e.g. `sa`, `co`, `cj`, `Candidate_interview`, etc.)
- Item-level `roles: [...]` in the nav config

The demo accounts above are mapped as follows:

- **Super Admin – `sa`**
  - Super Admin Dashboard
  - Central HR setups (Country, State, City, Company, Profession, Designation, Education, Bank, Skill)
  - Employee information (Outsource candidate, etc.)
  - HRMS Payment & Payroll configuration

- **Company – `co`**
  - Company Dashboard
  - Company Employee management
  - Recruitment (Company Schedule Interview, Job Description, Interview Panel)
  - Attendance setup for employees
  - Performance evaluation team & related modules

- **Employee – `cj` (and related employee roles)**
  - Employee Dashboard
  - Performance self-evaluation
  - Attendance status and related views

For demo accounts, a helper flag `sessionStorage.demoAllModules = "true"` is used by the nav components to **skip role filtering**, so clients can see the full menu tree regardless of the underlying role.

---

## 5. Attendance Module (Employee Demo)

The project includes a complete **Attendance** module under the dashboard:

- **Add / Manage Attendance** (company / HR side)
  - Route: `paths.dashboard.setup.AttendancePage`
  - Page: `src/pages/dashboard/setup/attendancePage.jsx`
  - View: `src/sections/setup/view/attendance.jsx`
  - Features:
    - “Add New Attendance” button
    - Mark Present/Absent for employees on a selected date
    - Edit and delete attendance records
    - View monthly attendance summary with progress bars

- **Employee Attendance View** (employee side)
  - Route: `paths.dashboard.setup.AttendanceCandidatePage`
  - Page: `src/pages/dashboard/setup/attendanceCandidatePage.jsx`
  - View: `src/sections/setup/view/attendanceCandidate.jsx`
  - Features:
    - Employee-specific monthly attendance overview
    - Day-by-day status (Present/Absent) table

For demo accounts, the **Attendance** menu item is visible to:

- `co` (Company)
- `cj` (Employee)
- `Candidate_interview`, `Candidate_Performance`, `Candidate_interview_Performance`

This allows you to show both **company-side attendance management** and **employee-side attendance view** in a demo.

---

## 6. What Was Implemented for the Demo

To make the project easy to demo to clients **without backend dependencies**, the following changes were added:

1. **Frontend-only JWT demo auth**
   - Implemented in `src/auth/context/jwt/auth-provider.jsx`
   - Generates a mock JWT token and sets it in storage
   - Initializes the auth context from this token on refresh

2. **Multiple demo accounts**
   - `demo@gmail.com`, `company@gmail.com`, `user@gmail.com`, `employee@gmail.com` (all `123456`)
   - Each mapped to a meaningful role (`sa`, `co`, `cj`)

3. **Demo login shortcuts on the JWT login page**
   - Implemented in `src/sections/auth/jwt/jwt-login-view.jsx`
   - If the entered email/password matches a demo account:
     - Skips API calls
     - Sets all required session values
     - Redirects directly to the correct dashboard

4. **Show-all-modules behavior for demo accounts**
   - A `demoAllModules` flag in `sessionStorage` is checked by nav items
   - Allows all nav entries to be visible, even if `roles` would normally hide them
   - This makes demos more complete and impressive for clients

5. **Attendance access for employees**
   - Updated nav configuration so employee roles can reach the Attendance module
   - Ensures you can demo employees adding/viewing attendance records

These changes make the app **client-demo ready**: you can open it locally, use the demo logins, and walk through core HR workflows without any backend setup.

---

## 7. Notes

- In a real production setup, the JWT generation and role handling should come from a secure backend.
- The demo tokens here are intentionally simple and are **not secure**—they exist only to support UI/UX demos.

