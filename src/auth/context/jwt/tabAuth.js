// src/auth/context/jwt/tabAuth.js

const AUTH_DATA_KEY = 'authData';

export const setTabAuthData = (data) => {
  sessionStorage.setItem(AUTH_DATA_KEY, JSON.stringify(data));
};

export const getTabAuthData = () => {
  const authData = sessionStorage.getItem(AUTH_DATA_KEY);
  return authData ? JSON.parse(authData) : null;
};

export const clearTabAuthData = () => {
  sessionStorage.removeItem(AUTH_DATA_KEY);
};
