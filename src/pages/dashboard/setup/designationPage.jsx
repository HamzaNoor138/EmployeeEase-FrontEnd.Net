import { Helmet } from 'react-helmet-async';

import { DesignationView } from 'src/sections/setup/view';

export default function designationPage() {
  return (
    <>
      <Helmet>DesignationPage</Helmet>
      <DesignationView />
    </>
  );
}
