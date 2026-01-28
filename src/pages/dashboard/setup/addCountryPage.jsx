import { Helmet } from 'react-helmet-async';

import { AddCountryView } from 'src/sections/setup/view';

export default function addCountryPage() {
  return (
    <>
      <Helmet>Add Country Page</Helmet>
      <AddCountryView />
    </>
  );
}
