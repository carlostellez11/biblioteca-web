
import { apiRequest } from './api';

export async function login(email, password) {
  const data = await apiRequest('/api/auth/login', {
    method: 'POST',
    body: { email, password },
    auth: false,
  });

  localStorage.setItem('biblioteca_token', data.token);
  localStorage.setItem('biblioteca_user', JSON.stringify(data.user));

  return data.user;
}

export function logout() {
  localStorage.removeItem('biblioteca_token');
  localStorage.removeItem('biblioteca_user');
}

export function getStoredUser() {
  const user = localStorage.getItem('biblioteca_user');

  return user ? JSON.parse(user) : null;
}
