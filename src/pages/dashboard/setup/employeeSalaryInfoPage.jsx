import { Helmet } from 'react-helmet-async';

import { EmployeeSalaryInfoView } from 'src/sections/setup/view';

export default function employeeSalaryInfoPage() {
  return (
    <>
      <Helmet>Employee Salary Info Page</Helmet>
      <EmployeeSalaryInfoView />
    </>
  );
}
