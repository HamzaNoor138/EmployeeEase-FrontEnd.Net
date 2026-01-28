import { Helmet } from 'react-helmet-async';

import { ClassicResetPasswordView2 } from 'src/sections/auth-demo/classic';

// ----------------------------------------------------------------------

export default function ClassicForgotPasswordPage() {
  return (
    <>
      <Helmet>
        <title> Reset Password</title>
      </Helmet>

      <ClassicResetPasswordView2 />
    </>
  );
}
