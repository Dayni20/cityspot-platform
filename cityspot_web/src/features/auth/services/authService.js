import { apiClient } from "../../../services/apiClient";
import {
  clearSession,
  saveSession
} from "../../../services/sessionStorage";

export async function login(email, password) {
  const response = await apiClient.post("/users/login", {
    email,
    password
  });

  saveSession({
    token: response.token,
    user: response.user
  });

  return response.user;
}

export async function register(data) {
  return apiClient.post("/users/register", data);
}

export function logout() {
  clearSession();
}