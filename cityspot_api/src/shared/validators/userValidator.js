const validator = require("validator");
const AppError = require("../errors/AppError");

const PUBLIC_REGISTRATION_ROLES = ["USUARIO", "PROPIETARIO"];
const NAME_REGEX = /^[\p{L}\s]+$/u;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?!.*\s).{8,72}$/;
const PHONE_REGEX = /^[0-9]{7,15}$/;

function normalizeName(name) {
  if (!name || !String(name).trim()) {
    throw new AppError("Name is required", 400);
  }

  const normalizedName = String(name).trim().replace(/\s+/g, " ");

  if (normalizedName.length < 2 || normalizedName.length > 100) {
    throw new AppError("Name must be between 2 and 100 characters", 400);
  }

  if (!NAME_REGEX.test(normalizedName)) {
    throw new AppError("Name can only contain letters and spaces", 400);
  }

  return normalizedName;
}

function normalizeEmail(email) {
  if (!email || !String(email).trim()) {
    throw new AppError("Email is required", 400);
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  if (normalizedEmail.length > 150) {
    throw new AppError("Email must not exceed 150 characters", 400);
  }

  if (!validator.isEmail(normalizedEmail)) {
    throw new AppError("Email format is invalid", 400);
  }

  return normalizedEmail;
}

function validatePassword(password) {
  if (!password) {
    throw new AppError("Password is required", 400);
  }

  const value = String(password);

  if (!PASSWORD_REGEX.test(value)) {
    throw new AppError(
      "Password must be 8 to 72 characters, without spaces, and include uppercase, lowercase and number",
      400
    );
  }

  return value;
}

function normalizePhone(phone) {
  if (phone === undefined || phone === null || phone === "") {
    return null;
  }

  const normalizedPhone = String(phone).trim();

  if (!PHONE_REGEX.test(normalizedPhone)) {
    throw new AppError("Phone must contain 7 to 15 digits", 400);
  }

  return normalizedPhone;
}

function validatePublicRegistrationRole(role) {
  if (!role) {
    throw new AppError("Role is required", 400);
  }

  const normalizedRole = String(role).trim().toUpperCase();

  if (!PUBLIC_REGISTRATION_ROLES.includes(normalizedRole)) {
    throw new AppError("Public registration role must be USUARIO or PROPIETARIO", 400);
  }

  return normalizedRole;
}

module.exports = {
  normalizeName,
  normalizeEmail,
  validatePassword,
  normalizePhone,
  validatePublicRegistrationRole
};
