import { Helmet } from 'react-helmet-async';

import { CompanyView } from 'src/sections/setup/view/';

export default function CountryType() {
  return (
    <>
      <Helmet>Company Page</Helmet>
      <CompanyView />
    </>
  );
}
