const AppError = require("../errors/AppError");

function normalizeInquiryId(id) {
  const inquiryId = Number(id);

  if (!Number.isInteger(inquiryId) || inquiryId <= 0) {
    throw new AppError("Inquiry id is invalid", 400);
  }

  return inquiryId;
}

function normalizeInquiryText(value, field) {
  if (!value || !String(value).trim()) {
    throw new AppError(`${field} is required`, 400);
  }

  const normalizedValue = String(value).trim().replace(/\s+/g, " ");

  if (normalizedValue.length < 5 || normalizedValue.length > 500) {
    throw new AppError(`${field} must be between 5 and 500 characters`, 400);
  }

  return normalizedValue;
}

module.exports = {
  normalizeInquiryId,
  normalizeInquiryText
};
