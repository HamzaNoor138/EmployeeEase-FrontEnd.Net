import { Helmet } from 'react-helmet-async';

import { ModernRegisterCompanyView } from 'src/sections/auth-demo/modern';

// ----------------------------------------------------------------------

export default function ModernRegisterPage() {
  return (
    <>
      <Helmet>
        <title>Register Company</title>
      </Helmet>

      <ModernRegisterCompanyView />
    </>
  );
}
