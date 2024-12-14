export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token'); // Check if token exists
};

export const logout = (): void => {
  localStorage.removeItem('token'); // Clear token on logout
};
