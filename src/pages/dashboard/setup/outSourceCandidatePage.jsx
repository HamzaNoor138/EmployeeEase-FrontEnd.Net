import { Helmet } from 'react-helmet-async';

import { OutSourceCandidateView as OutSource } from 'src/sections/setup/view';

export default function OutSourceCandidateView() {
  return (
    <>
      <Helmet> OutSourceCandidateView Page</Helmet>
      <OutSource />
    </>
  );
}
