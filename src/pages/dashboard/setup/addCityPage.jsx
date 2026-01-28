import { Helmet } from 'react-helmet-async';

import { AddCityView } from 'src/sections/setup/view';

export default function addCityPage() {
  return (
    <>
      <Helmet>Add City Page</Helmet>
      <AddCityView />
    </>
  );
}
