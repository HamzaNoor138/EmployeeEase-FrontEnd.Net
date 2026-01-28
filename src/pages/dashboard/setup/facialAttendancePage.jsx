import { Helmet } from 'react-helmet-async';

import { FacialAttendanceView } from 'src/sections/setup/view';

export default function FacialAttendancePage() {
  return (
    <>
      <Helmet>Facial Recognition Attendance </Helmet>
      <FacialAttendanceView />
    </>
  );
}
