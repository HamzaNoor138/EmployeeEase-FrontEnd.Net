import { Helmet } from 'react-helmet-async';

import { CompanyEmployeeView } from 'src/sections/setup/view/';

export default function CountryType() {
  return (
    <>
      <Helmet>Company Employee View</Helmet>
      <CompanyEmployeeView />
    </>
  );
}
