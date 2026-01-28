import { Helmet } from 'react-helmet-async';
import { AttendanceCandidate as AttendanceView } from 'src/sections/setup/view'; // Rename the import

export default function AttendanceCandidatePage() {
  return (
    <>
      <Helmet>Attendance View</Helmet>
      <AttendanceView /> {/* Use the renamed component here */}
    </>
  );
}
