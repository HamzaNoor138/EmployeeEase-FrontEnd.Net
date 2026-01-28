import { Helmet } from 'react-helmet-async';

import { ClassicVerifyView2 } from 'src/sections/auth-demo/classic';

// ----------------------------------------------------------------------

export default function ClassicVerifyPage() {
  return (
    <>
      <Helmet>
        <title> Verify Email</title>
      </Helmet>

      <ClassicVerifyView2 />
    </>
  );
}
