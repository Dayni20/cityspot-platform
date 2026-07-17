const AppError = require("../errors/AppError");

const CATEGORY_NAME_REGEX = /^[\p{L}\s]+$/u;

function toTitleCase(value) {
  return value
    .toLocaleLowerCase("es")
    .split(" ")
    .map((word) => word.charAt(0).toLocaleUpperCase("es") + word.slice(1))
    .join(" ");
}

function normalizeCategoryName(name) {
  if (!name || !String(name).trim()) {
    throw new AppError("Category name is required", 400);
  }

  const normalizedName = toTitleCase(String(name).trim().replace(/\s+/g, " "));

  if (normalizedName.length < 3 || normalizedName.length > 100) {
    throw new AppError("Category name must be between 3 and 100 characters", 400);
  }

  if (!CATEGORY_NAME_REGEX.test(normalizedName)) {
    throw new AppError("Category name can only contain letters and spaces", 400);
  }

  return normalizedName;
}

function normalizeCategoryDescription(description) {
  if (description === undefined || description === null || description === "") {
    return null;
  }

  const normalizedDescription = String(description).trim().replace(/\s+/g, " ");

  if (normalizedDescription.length > 500) {
    throw new AppError("Category description must not exceed 500 characters", 400);
  }

  return normalizedDescription;
}

function normalizeCategoryId(id) {
  const categoryId = Number(id);

  if (!Number.isInteger(categoryId) || categoryId <= 0) {
    throw new AppError("Category id is invalid", 400);
  }

  return categoryId;
}

module.exports = {
  normalizeCategoryName,
  normalizeCategoryDescription,
  normalizeCategoryId
};
