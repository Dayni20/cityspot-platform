import { API_BASE_URL } from "../config/env";
import { clearSession, getToken } from "./sessionStorage";

class ApiError extends Error {
  constructor(message, status, details = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

const apiMessageTranslations = {
  "Phone must contain 7 to 15 digits and may start with +":
    "El teléfono debe contener entre 7 y 15 dígitos y puede iniciar con +.",
  "Password must be 8 to 72 characters, without spaces, and include uppercase, lowercase and number":
    "La contraseña debe tener entre 8 y 72 caracteres, sin espacios, e incluir mayúscula, minúscula y número.",
  "Password confirmation does not match":
    "La confirmación de la contraseña no coincide.",
  "Email format is invalid":
    "El formato del correo no es válido.",
  "Name can only contain letters and spaces":
    "El nombre solo puede contener letras y espacios.",
  "Invalid credentials":
    "Correo o contraseña incorrectos.",
  "Current password is incorrect":
    "La contraseña actual es incorrecta.",
  "Email already exists":
    "El correo ingresado ya se encuentra registrado.",
  "User not found":
    "No se encontró el usuario.",
  "Unauthorized":
    "No tienes autorización para realizar esta acción.",
  "Forbidden":
    "No tienes permisos para realizar esta acción.",
  "Bad Request":
    "La solicitud no es válida. Revisa la información ingresada.",
  "Internal Server Error":
    "Ocurrió un error en el servidor. Inténtalo nuevamente.",
  "Not found":
    "No se encontró la información solicitada."
};

const fieldTranslations = {
  name: "nombre",
  email: "correo",
  phone: "teléfono",
  password: "contraseña",
  currentPassword: "contraseña actual",
  newPassword: "nueva contraseña",
  confirmPassword: "confirmación de contraseña",
  role: "tipo de cuenta",
  status: "estado",
  description: "descripción",
  city: "ciudad",
  address: "dirección",
  latitude: "latitud",
  longitude: "longitud",
  referencePrice: "precio de referencia",
  schedule: "horario",
  contactPhone: "teléfono de contacto",
  contactEmail: "correo de contacto",
  categoryId: "categoría"
};

function translateFieldName(field) {
  const cleanField = String(field || "")
    .replace(/^["']|["']$/g, "")
    .replace(/^body\./, "")
    .trim();

  return fieldTranslations[cleanField] || cleanField || "campo";
}

function translateApiMessage(message) {
  if (Array.isArray(message)) {
    return message.map(translateApiMessage).join(" ");
  }

  if (!message) return "Error en la solicitud";

  const normalizedMessage = String(message).trim();

  if (apiMessageTranslations[normalizedMessage]) {
    return apiMessageTranslations[normalizedMessage];
  }

  let match = normalizedMessage.match(/^(.+?) is required$/i);
  if (match) return `El campo ${translateFieldName(match[1])} es obligatorio.`;

  match = normalizedMessage.match(/^(.+?) must not be empty$/i);
  if (match) return `El campo ${translateFieldName(match[1])} no puede estar vacío.`;

  match = normalizedMessage.match(/^(.+?) must be a valid email$/i);
  if (match) return `El formato del ${translateFieldName(match[1])} no es válido.`;

  match = normalizedMessage.match(/^(.+?) format is invalid$/i);
  if (match) return `El formato del ${translateFieldName(match[1])} no es válido.`;

  match = normalizedMessage.match(/^(.+?) must be at least (\d+) characters$/i);
  if (match) return `El campo ${translateFieldName(match[1])} debe tener al menos ${match[2]} caracteres.`;

  match = normalizedMessage.match(/^(.+?) must be at most (\d+) characters$/i);
  if (match) return `El campo ${translateFieldName(match[1])} debe tener como máximo ${match[2]} caracteres.`;

  match = normalizedMessage.match(/^(.+?) must be between (\d+) and (\d+) characters$/i);
  if (match) return `El campo ${translateFieldName(match[1])} debe tener entre ${match[2]} y ${match[3]} caracteres.`;

  match = normalizedMessage.match(/^(.+?) must contain only letters and spaces$/i);
  if (match) return `El campo ${translateFieldName(match[1])} solo puede contener letras y espacios.`;

  match = normalizedMessage.match(/^(.+?) can only contain letters and spaces$/i);
  if (match) return `El campo ${translateFieldName(match[1])} solo puede contener letras y espacios.`;

  match = normalizedMessage.match(/^(.+?) must be a number$/i);
  if (match) return `El campo ${translateFieldName(match[1])} debe ser un número.`;

  match = normalizedMessage.match(/^(.+?) must be a string$/i);
  if (match) return `El campo ${translateFieldName(match[1])} debe ser texto.`;

  match = normalizedMessage.match(/^(.+?) already exists$/i);
  if (match) return `El ${translateFieldName(match[1])} ya existe.`;

  match = normalizedMessage.match(/^(.+?) not found$/i);
  if (match) return `No se encontró ${translateFieldName(match[1])}.`;

  if (/validation|invalid|required|must|should|not match|not found|already exists|unauthorized|forbidden/i.test(normalizedMessage)) {
    return "Los datos ingresados no son válidos. Revisa la información e inténtalo nuevamente.";
  }

  return normalizedMessage;
}

function getApiErrorMessage(data) {
  if (!data || typeof data !== "object") {
    return typeof data === "string" && data.trim() ? data : "Error en la solicitud";
  }

  if (Array.isArray(data.message)) {
    return data.message;
  }

  if (Array.isArray(data.errors)) {
    return data.errors
      .map((error) => {
        if (typeof error === "string") return error;
        return error?.message || error?.msg || error?.error;
      })
      .filter(Boolean)
      .map(translateApiMessage)
      .join(" ");
  }

  if (data.errors && typeof data.errors === "object") {
    return Object.values(data.errors).flat().filter(Boolean);
  }

  return data.message || data.error || "Error en la solicitud";
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  const isFormData = options.body instanceof FormData;

  headers.set("Accept", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  if (options.body && !isFormData) headers.set("Content-Type", "application/json");

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      body: options.body && !isFormData ? JSON.stringify(options.body) : options.body
    });
  } catch {
    throw new ApiError(
      "No se pudo conectar con el servidor. Verifica que el backend esté ejecutándose.",
      0
    );
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : await response.text().catch(() => "");

  if (!response.ok) {
    if (response.status === 401) clearSession();
    throw new ApiError(translateApiMessage(getApiErrorMessage(data)), response.status, data);
  }

  return data;
}

export const apiClient = {
  get: (path, options) => request(path, { ...options, method: "GET" }),
  post: (path, body, options) => request(path, { ...options, method: "POST", body }),
  put: (path, body, options) => request(path, { ...options, method: "PUT", body }),
  patch: (path, body, options) => request(path, { ...options, method: "PATCH", body }),
  delete: (path, options) => request(path, { ...options, method: "DELETE" })
};

export { ApiError };
