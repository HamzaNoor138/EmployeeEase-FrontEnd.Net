import { Helmet } from 'react-helmet-async';

import { SuperDashboardView } from 'src/sections/setup/view';

export default function SkillPage() {
  return (
    <>
      <Helmet> Super Dashboard View </Helmet>
      <SuperDashboardView />
    </>
  );
}
