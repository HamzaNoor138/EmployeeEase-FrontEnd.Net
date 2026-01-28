import { Helmet } from 'react-helmet-async';

import { BankView } from 'src/sections/setup/view';

export default function bankPage() {
  return (
    <>
      <Helmet>BankPage</Helmet>
      <BankView />
    </>
  );
}
