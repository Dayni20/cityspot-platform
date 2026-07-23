const TOKEN_KEY = "cityspot_token";
const USER_KEY = "cityspot_user";
const EXPIRES_AT_KEY = "cityspot_expires_at";

function getTokenExpiration(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function saveSession({ token, user }) {
  if (!token || !user) {
    throw new Error(
      "La respuesta del login no contiene token o usuario."
    );
  }

  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));

  const expiresAt = getTokenExpiration(token);
  if (expiresAt) {
    localStorage.setItem(EXPIRES_AT_KEY, String(expiresAt));
  }
}

export function getToken() {
  if (isSessionExpired()) {
    clearSession();
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser() {
  if (isSessionExpired()) {
    clearSession();
    return null;
  }

  const value = localStorage.getItem(USER_KEY);

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    clearSession();
    return null;
  }
}

export function isSessionExpired() {
  const expiresAt = Number(localStorage.getItem(EXPIRES_AT_KEY));

  if (!expiresAt) {
    return false;
  }

  return Date.now() >= expiresAt;
}

export function getSessionExpiresAt() {
  const expiresAt = Number(localStorage.getItem(EXPIRES_AT_KEY));
  return expiresAt || null;
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(EXPIRES_AT_KEY);
}
