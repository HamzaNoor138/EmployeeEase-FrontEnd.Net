import { Helmet } from 'react-helmet-async';

import { PerformanceEvaluationView } from 'src/sections/setup/view';

export default function TerritoryPage() {
  return (
    <>
      <Helmet>Performance EvaluationPage</Helmet>
      <PerformanceEvaluationView />
    </>
  );
}
