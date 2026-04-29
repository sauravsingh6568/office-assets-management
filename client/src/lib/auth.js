const TOKEN_KEY = "officehub.admin.token";
const USER_KEY = "officehub.admin.user";

export function getAuthToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setAuthSession(authResponse) {
  localStorage.setItem(TOKEN_KEY, authResponse.token);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      userId: authResponse.userId,
      name: authResponse.name,
      email: authResponse.email,
      role: authResponse.role,
    }),
  );
}

export function clearAuthSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAuthUser() {
  const rawUser = localStorage.getItem(USER_KEY);
  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    clearAuthSession();
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}
