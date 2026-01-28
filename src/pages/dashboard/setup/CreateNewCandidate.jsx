import { Helmet } from 'react-helmet-async';
import { CandidateNewEditForm } from 'src/sections/setup/view';

export default function CreateNewCandidate() {
  return (
    <>
      <Helmet>New Candidate</Helmet>
      <CandidateNewEditForm />
    </>
  );
}
