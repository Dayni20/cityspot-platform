const AppError = require("../errors/AppError");

const CITY_REGEX = /^[\p{L}\s]+$/u;
const ACTIVITY_TYPE_REGEX = /^[\p{L}\s]+$/u;

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

function normalizeCity(city) {
  const normalizedCity = normalizeOptionalText(city, "City", 100);

  if (normalizedCity && !CITY_REGEX.test(normalizedCity)) {
    throw new AppError("City can only contain letters and spaces", 400);
  }

  return normalizedCity;
}

function normalizeCompany(company) {
  return normalizeOptionalText(company, "Company", 80);
}

function normalizeBudget(budget) {
  if (budget === undefined || budget === null || budget === "") {
    return null;
  }

  const normalizedBudget = Number(budget);

  if (!Number.isFinite(normalizedBudget) || normalizedBudget < 0) {
    throw new AppError("Budget must be greater than or equal to 0", 400);
  }

  return normalizedBudget;
}

function normalizeActivityType(activityType) {
  const normalizedActivityType = normalizeOptionalText(activityType, "Activity type", 100);

  if (normalizedActivityType && !ACTIVITY_TYPE_REGEX.test(normalizedActivityType)) {
    throw new AppError("Activity type can only contain letters and spaces", 400);
  }

  return normalizedActivityType;
}

function validateAtLeastOneSearchField(searchData) {
  const hasSearchCriteria = Object.values(searchData).some(
    (value) => value !== null && value !== undefined && value !== ""
  );

  if (!hasSearchCriteria) {
    throw new AppError("At least one search field is required", 400);
  }
}

function normalizeMongoId(id, field = "Search history id") {
  if (!id || !String(id).trim()) {
    throw new AppError(`${field} is required`, 400);
  }

  return String(id).trim();
}

module.exports = {
  normalizeCity,
  normalizeCompany,
  normalizeBudget,
  normalizeActivityType,
  validateAtLeastOneSearchField,
  normalizeMongoId
};
