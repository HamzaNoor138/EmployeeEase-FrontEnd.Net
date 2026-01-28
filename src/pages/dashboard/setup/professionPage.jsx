import { Helmet } from 'react-helmet-async';

import { ProfessionView } from 'src/sections/setup/view';

export default function professionPage() {
  return (
    <>
      <Helmet>ProfessionPage</Helmet>
      <ProfessionView />
    </>
  );
}
