import { Helmet } from 'react-helmet-async';

import { InterviewPanelView } from 'src/sections/setup/view';

export default function interviewPanelPage() {
  return (
    <>
      <Helmet>Interview Panel Page</Helmet>
      <InterviewPanelView />
    </>
  );
}
