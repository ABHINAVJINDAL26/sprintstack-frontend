export const getPostLoginRoute = (role) => {
  if (role === 'developer' || role === 'qa') return '/sprints/board';
  return '/dashboard';
};
