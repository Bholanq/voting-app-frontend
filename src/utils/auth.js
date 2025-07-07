// save the token to localStorage
export const saveToken = (token) => {
  localStorage.setItem('token', token);
};

// retrieve the token from localStorage
export const getToken = () => {
  return localStorage.getItem('token');
};

// remove the token from localStorage (logout)
export const removeToken = () => {
  localStorage.removeItem('token');
};
