import { Helmet } from 'react-helmet-async';

import { CandidateRegisterView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export default function CandidateRegisterPage() {
  return (
    <>
      <Helmet>
        <title> Candidate Register </title>
      </Helmet>

      <CandidateRegisterView />
    </>
  );
}
