import { Helmet } from 'react-helmet-async';

import { EducationView } from 'src/sections/setup/view';

export default function educationPage() {
  return (
    <>
      <Helmet>EducationPage</Helmet>
      <EducationView />
    </>
  );
}
