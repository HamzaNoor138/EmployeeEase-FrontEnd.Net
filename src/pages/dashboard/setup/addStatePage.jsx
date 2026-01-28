import { Helmet } from 'react-helmet-async';

import { AddStateView } from 'src/sections/setup/view';

export default function addStatePage() {
  return (
    <>
      <Helmet>Add State Page</Helmet>
      <AddStateView />
    </>
  );
}
