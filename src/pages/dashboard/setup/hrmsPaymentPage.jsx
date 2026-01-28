import { Helmet } from 'react-helmet-async';

import { HrmsPaymentView } from 'src/sections/setup/view';

export default function BussinessUnitPage() {
  return (
    <>
      <Helmet>Hrms Payment Page</Helmet>
      <HrmsPaymentView />
    </>
  );
}
