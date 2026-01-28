import { Helmet } from 'react-helmet-async';

import { Attendance } from 'src/sections/setup/view';

export default function attendance() {
  return (
    <>
      <Helmet>Attendance</Helmet>
      <Attendance />
    </>
  );
}
