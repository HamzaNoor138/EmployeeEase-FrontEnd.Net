import { Navigate, useRoutes } from 'react-router-dom';

// import MainLayout from 'src/layouts/main';

import { PATH_AFTER_LOGIN } from 'src/config-global';
import { authRoutes } from './auth';
import { authDemoRoutes } from './auth-demo';
import { HomePage, mainRoutes } from './main';
import { dashboardRoutes } from './dashboard';
import { componentsRoutes } from './components';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // SET INDEX PAGE TO GO DIRECTLY TO DASHBOARD (NO LOGIN)
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },

    // Optional: keep home page accessible at `/home` if needed
    {
      path: '/home',
      element: (
        // Main layout / marketing page is no longer the default entry
        // but can still be visited directly.
        <HomePage />
      ),
    },

    // Auth routes (kept for backward compatibility, but not linked from entry)
    ...authRoutes,
    ...authDemoRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // Main routes
    ...mainRoutes,

    // Components routes
    ...componentsRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
