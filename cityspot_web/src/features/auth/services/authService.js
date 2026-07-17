import { apiClient } from "../../../services/apiClient";
import { clearSession, saveSession } from "../../../services/sessionStorage";

export async function login(email, password) {
  const response = await apiClient.post("/users/login", { email, password });
  saveSession(response);
  return response.user;
}

export function logout() {
  clearSession();
}
