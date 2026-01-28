import { Helmet } from 'react-helmet-async';

//
import { UserAddView } from 'src/sections/user/view';

// ----------------------------------------------------------------------

export default function UserAddPage() {
  // const params = useParams();

  // const { id } = params;

  return (
    <>
      <Helmet>
        <title> Dashboard: User Add</title>
      </Helmet>
      <UserAddView />
      {/* <UserEditView id={`${id}`} /> */}
    </>
  );
}
