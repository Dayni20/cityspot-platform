const validator = require("validator");
const AppError = require("../errors/AppError");

const ACTIVITY_STATUSES = ["PENDIENTE", "ACTIVA", "INACTIVA"];
const CITY_REGEX = /^[\p{L}\s]+$/u;
const PHONE_REGEX = /^\+?[0-9]{7,15}$/;

function normalizeText(value, field, min, max) {
  if (!value || !String(value).trim()) {
    throw new AppError(`${field} is required`, 400);
  }

  const normalizedValue = String(value).trim().replace(/\s+/g, " ");

  if (normalizedValue.length < min || normalizedValue.length > max) {
    throw new AppError(`${field} must be between ${min} and ${max} characters`, 400);
  }

  return normalizedValue;
}

function normalizeOptionalText(value, field, max) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const normalizedValue = String(value).trim().replace(/\s+/g, " ");

  if (normalizedValue.length > max) {
    throw new AppError(`${field} must not exceed ${max} characters`, 400);
  }

  return normalizedValue;
}

function normalizeActivityId(id) {
  const activityId = Number(id);

  if (!Number.isInteger(activityId) || activityId <= 0) {
    throw new AppError("Activity id is invalid", 400);
  }

  return activityId;
}

function normalizeCategoryId(categoryId) {
  const id = Number(categoryId);

  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("Category id is invalid", 400);
  }

  return id;
}

function normalizeActivityName(name) {
  return normalizeText(name, "Activity name", 3, 150);
}

function normalizeActivityDescription(description) {
  return normalizeText(description, "Activity description", 10, 2000);
}

function normalizeCity(city) {
  const normalizedCity = normalizeText(city, "City", 2, 100);

  if (!CITY_REGEX.test(normalizedCity)) {
    throw new AppError("City can only contain letters and spaces", 400);
  }

  return normalizedCity;
}

function normalizeCoordinate(value, field, min, max) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const coordinate = Number(value);

  if (!Number.isFinite(coordinate) || coordinate < min || coordinate > max) {
    throw new AppError(`${field} is invalid`, 400);
  }

  return coordinate;
}

function normalizeReferencePrice(price) {
  if (price === undefined || price === null || price === "") {
    return null;
  }

  const value = Number(price);

  if (!Number.isFinite(value) || value < 0) {
    throw new AppError("Reference price must be greater than or equal to 0", 400);
  }

  return value;
}

function normalizeContactPhone(phone) {
  if (phone === undefined || phone === null || phone === "") {
    return null;
  }

  const normalizedPhone = String(phone).trim();

  if (!PHONE_REGEX.test(normalizedPhone)) {
    throw new AppError("Contact phone must contain 7 to 15 digits and may start with +", 400);
  }

  return normalizedPhone;
}

function normalizeContactEmail(email) {
  if (email === undefined || email === null || email === "") {
    return null;
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  if (normalizedEmail.length > 150 || !validator.isEmail(normalizedEmail)) {
    throw new AppError("Contact email format is invalid", 400);
  }

  return normalizedEmail;
}

function normalizeActivityStatus(status) {
  if (!status || !String(status).trim()) {
    throw new AppError("Activity status is required", 400);
  }

  const normalizedStatus = String(status).trim().toUpperCase();

  if (!ACTIVITY_STATUSES.includes(normalizedStatus)) {
    throw new AppError("Activity status must be PENDIENTE, ACTIVA or INACTIVA", 400);
  }

  return normalizedStatus;
}

module.exports = {
  normalizeActivityId,
  normalizeCategoryId,
  normalizeActivityName,
  normalizeActivityDescription,
  normalizeCity,
  normalizeOptionalText,
  normalizeCoordinate,
  normalizeReferencePrice,
  normalizeContactPhone,
  normalizeContactEmail,
  normalizeActivityStatus
};
