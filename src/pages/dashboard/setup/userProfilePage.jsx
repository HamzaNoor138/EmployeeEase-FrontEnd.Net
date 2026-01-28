import { Helmet } from 'react-helmet-async';

import { UserProfileView } from 'src/sections/setup/view';

export default function UserProflePage() {
  return (
    <>
      <Helmet>User Prole Page</Helmet>
      <UserProfileView />
    </>
  );
}
