import { Helmet } from 'react-helmet-async';

import { CompanyDashboardView } from 'src/sections/setup/view';

export default function CompanyDashboardPage() {
  return (
    <>
      <Helmet> Company Dashboard Page</Helmet>
      <CompanyDashboardView />
    </>
  );
}
