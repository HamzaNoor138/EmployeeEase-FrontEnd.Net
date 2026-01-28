import { Helmet } from 'react-helmet-async';

import { CandidateInterview } from 'src/sections/setup/view/';

export default function CountryType() {
  return (
    <>
      <Helmet>Candidate Interview Page</Helmet>
      <CandidateInterview />
    </>
  );
}
