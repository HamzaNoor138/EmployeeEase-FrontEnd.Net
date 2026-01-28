import { Helmet } from 'react-helmet-async';

import { CompanyScheduleInterview } from 'src/sections/setup/view/';

export default function CountryType() {
  return (
    <>
      <Helmet>Company Schedule Interview Page</Helmet>
      <CompanyScheduleInterview />
    </>
  );
}
