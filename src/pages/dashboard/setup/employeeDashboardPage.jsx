import { Helmet } from 'react-helmet-async';

import { EmployeeDashboardView } from 'src/sections/setup/view';

export default function EmployeeDashboardPage() {
  return (
    <>
      <Helmet> Employee Dashboard Page</Helmet>
      <EmployeeDashboardView />
    </>
  );
}
