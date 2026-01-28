import { Helmet } from 'react-helmet-async';

import { EmployeeSelfEvaluation } from 'src/sections/setup/view';

export default function EmployeeSelfEvaluationPage() {
  return (
    <>
      <Helmet>Employee Self Evaluation</Helmet>
      <EmployeeSelfEvaluation />
    </>
  );
}
