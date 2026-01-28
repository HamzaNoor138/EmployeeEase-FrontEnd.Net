import PropTypes from 'prop-types';
import { useMemo, useEffect, useReducer, useCallback } from 'react';

import axios, { endpoints } from 'src/utils/axios';

import { AuthContext } from './auth-context';
import { setSession, isValidToken, jwtDecode } from './utils';
import { getAuthToken, setAuthToken } from 'src/utils/storage-available';

// ----------------------------------------------------------------------

// NOTE:
// We only build demo at basic level.
// Customer will need to do some extra handling yourself if you want to extend the logic and other features...

// ----------------------------------------------------------------------

const initialState = {
  user: null,
  loading: true,
};

const reducer = (state, action) => {
  if (action.type === 'INITIAL') {
    return {
      loading: false,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGIN') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'REGISTER') {
    return {
      ...state,
      user: action.payload.user,
    };
  }
  if (action.type === 'LOGOUT') {
    return {
      ...state,
      user: null,
    };
  }
  return state;
};

// ----------------------------------------------------------------------

const STORAGE_KEY = 'accessToken';

const DEMO_PASSWORD = '123456';

// Frontend-only demo accounts (no backend). All share the same password.
const DEMO_ACCOUNTS = {
  'demo@gmail.com': { role: 'sa' }, // Super admin
  'company@gmail.com': { role: 'co' }, // Company
  'user@gmail.com': { role: 'cj' }, // Employee
  'employee@gmail.com': { role: 'cj' }, // Employee
  'test@gmail.com': { role: 'sa' }, // Extra super admin demo account
};

function base64UrlEncode(input) {
  const json = typeof input === 'string' ? input : JSON.stringify(input);
  return window
    .btoa(json)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function createDemoJwt({ username, role }) {
  const now = Math.floor(Date.now() / 1000);

  const header = { alg: 'HS256', typ: 'JWT' };
  const payload = {
    username,
    role,
    email: username,
    iat: now,
    exp: now + 60 * 60 * 24 * 7, // 7 days
  };

  // NOTE: signature is not verified anywhere in this demo JWT flow.
  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.demo`;
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const storedToken = getAuthToken();

      // If there is a valid stored token, restore that session.
      if (storedToken && isValidToken(storedToken)) {
        const payload = jwtDecode(storedToken);

        sessionStorage.setItem('username', payload.username);
        sessionStorage.setItem('userType', payload.role);
        sessionStorage.setItem('email', payload.email);

        setSession(storedToken);

        const user = undefined;

        dispatch({
          type: 'INITIAL',
          payload: {
            user: {
              ...user,
              accessToken: storedToken,
            },
          },
        });
        return;
      }

      // No valid token found – automatically create a demo session.
      // Prefer `test@gmail.com` if available, otherwise fall back to `demo@gmail.com`.
      const demoUsername = DEMO_ACCOUNTS['test@gmail.com']
        ? 'test@gmail.com'
        : 'demo@gmail.com';
      const demoConfig = DEMO_ACCOUNTS[demoUsername] || { role: 'sa' };

      const accessToken = createDemoJwt({ username: demoUsername, role: demoConfig.role });

      setSession(accessToken);
      setAuthToken(accessToken);

      sessionStorage.setItem('username', demoUsername);
      sessionStorage.setItem('userType', demoConfig.role);
      sessionStorage.setItem('email', demoUsername);
      sessionStorage.setItem('demoAllModules', 'true');

      dispatch({
        type: 'INITIAL',
        payload: {
          user: {
            username: demoUsername,
            role: demoConfig.role,
            email: demoUsername,
            accessToken,
          },
        },
      });
    } catch (error) {
      console.error(error);
      dispatch({
        type: 'INITIAL',
        payload: {
          user: null,
        },
      });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // LOGIN
  const login = useCallback(async (username, password) => {
    // Frontend-only demo account (no backend/database required)
    const demo = DEMO_ACCOUNTS[username];

    if (demo && password === DEMO_PASSWORD) {
      const accessToken = createDemoJwt({ username, role: demo.role });

      setSession(accessToken);
      setAuthToken(accessToken);

      sessionStorage.setItem('username', username);
      sessionStorage.setItem('userType', demo.role);
      sessionStorage.setItem('email', username);
      sessionStorage.setItem('demoAllModules', 'true');

      dispatch({
        type: 'LOGIN',
        payload: {
          user: {
            username,
            role: demo.role,
            email: username,
            accessToken,
          },
        },
      });

      return;
    }

    // Ensure demo-only UI overrides are not leaked to real logins
    sessionStorage.removeItem('demoAllModules');

    const data = {
      username,
      password,
    };

    const response = await axios.post(endpoints.auth.login, data);

    const { accessToken, user } = response.data;

    setSession(accessToken);

    dispatch({
      type: 'LOGIN',
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  // REGISTER
  const register = useCallback(async (username, password, firstName, lastName) => {
    const data = {
      username,
      password,
      firstName,
      lastName,
    };

    const response = await axios.post(endpoints.auth.register, data);

    const { accessToken, user } = response.data;

    sessionStorage.setItem(STORAGE_KEY, accessToken);

    dispatch({
      type: 'REGISTER',
      payload: {
        user: {
          ...user,
          accessToken,
        },
      },
    });
  }, []);

  // LOGOUT
  const logout = useCallback(async () => {
    setSession(null);
    setAuthToken(null);
    sessionStorage.removeItem('demoAllModules');
    dispatch({
      type: 'LOGOUT',
    });
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user,
      method: 'jwt',
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
      //
      login,
      register,
      logout,
    }),
    [login, logout, register, state.user, status]
  );

  return <AuthContext.Provider value={memoizedValue}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = {
  children: PropTypes.node,
};
