import { Helmet } from 'react-helmet-async';

import { EmployeeView } from 'src/sections/setup/view';

export default function employeePage() {
  return (
    <>
      <Helmet>EmployeePage</Helmet>
      <EmployeeView />
    </>
  );
}
