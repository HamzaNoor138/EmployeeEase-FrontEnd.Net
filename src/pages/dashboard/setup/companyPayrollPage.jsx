import { Helmet } from 'react-helmet-async';

import { CompanyPayrollView } from 'src/sections/setup/view';
// ----------------------------------------------------------------------
export default function CompanyPayrollPage() {
  return (
    <>
      <Helmet>
        <title>Company Payroll</title>
      </Helmet>
      <CompanyPayrollView />
    </>
  );
}
