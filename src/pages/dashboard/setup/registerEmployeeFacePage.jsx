import { Helmet } from 'react-helmet-async';

import { RegisterEmployeeFaceView } from 'src/sections/setup/view';

export default function RegisterEmployeeFacePage() {
  return (
    <>
      <Helmet>
        <title> Register Employee Face</title>
      </Helmet>

      <RegisterEmployeeFaceView />
    </>
  );
}
