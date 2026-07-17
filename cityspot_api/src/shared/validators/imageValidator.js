const AppError = require("../errors/AppError");

const ALLOWED_IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGE_SIZE_IN_BYTES = 5 * 1024 * 1024;

function normalizeImageDescription(description) {
  if (description === undefined || description === null || description === "") {
    return null;
  }

  const normalizedDescription = String(description).trim().replace(/\s+/g, " ");

  if (normalizedDescription.length > 150) {
    throw new AppError("Image description must not exceed 150 characters", 400);
  }

  return normalizedDescription;
}

function normalizeBoolean(value) {
  if (value === undefined || value === null || value === "") {
    return false;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return String(value).trim().toLowerCase() === "true";
}

function validateImageFile(file) {
  if (!file) {
    throw new AppError("Image file is required", 400);
  }

  if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
    throw new AppError("Image must be JPEG, PNG or WEBP", 400);
  }

  if (file.size > MAX_IMAGE_SIZE_IN_BYTES) {
    throw new AppError("Image must not exceed 5 MB", 400);
  }
}

module.exports = {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_IN_BYTES,
  normalizeImageDescription,
  normalizeBoolean,
  validateImageFile
};
