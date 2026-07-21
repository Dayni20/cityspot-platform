const configuredUrl = import.meta.env.VITE_API_BASE_URL;

export const API_BASE_URL = (configuredUrl || "/api").replace(/\/$/, "");
export const APP_ENV = import.meta.env.MODE;
