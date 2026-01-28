import { Helmet } from 'react-helmet-async';

import { PerformanceEvaluationTeamView } from 'src/sections/setup/view';

export default function PerformanceEvaluationTeamPage() {
  return (
    <>
      <Helmet>Performance Evaluation Team page</Helmet>
      <PerformanceEvaluationTeamView />
    </>
  );
}
