import { Helmet } from 'react-helmet-async';

import { SkillView } from 'src/sections/setup/view';

export default function SkillPage() {
  return (
    <>
      <Helmet> Skill Page</Helmet>
      <SkillView />
    </>
  );
}
