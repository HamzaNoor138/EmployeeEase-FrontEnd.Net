// ----------------------------------------------------------------------

export function localStorageAvailable() {
  try {
    const key = '__some_random_key_you_are_not_going_to_use__';
    window.localStorage.setItem(key, key);
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    return false;
  }
}

export function localStorageGetItem(key, defaultValue = '') {
  const storageAvailable = localStorageAvailable();

  let value;

  if (storageAvailable) {
    value = localStorage.getItem(key) || defaultValue;
  }

  return value;
}

// auth.js
const TOKEN_KEY = 'MYtokenReturn'; // Set a unique key for your token in local storage
//const TOKEN_KEY = TOKEN_KEY1.access_token;

export const setAuthToken = (newToken) => {
  localStorage.setItem(TOKEN_KEY, newToken);
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};
