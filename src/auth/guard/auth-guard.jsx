import PropTypes from 'prop-types';

import { SplashScreen } from 'src/components/loading-screen';

import { useAuthContext } from '../hooks';

// ----------------------------------------------------------------------

// NOTE:
// For the public demo deployment we want the dashboard to be accessible
// without any login / redirect. This guard now only waits for the auth
// context to finish initialising and then always renders children.

export default function AuthGuard({ children }) {
  const { loading } = useAuthContext();

  if (loading) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

AuthGuard.propTypes = {
  children: PropTypes.node,
};
