const AppError = require("../../../../shared/errors/AppError");
const {
  normalizeCategoryId,
  normalizeActivityName,
  normalizeActivityDescription,
  normalizeCity,
  normalizeOptionalText,
  normalizeCoordinate,
  normalizeReferencePrice,
  normalizeContactPhone,
  normalizeContactEmail
} = require("../../../../shared/validators/activityValidator");

class UpdateActivityDto {
  constructor(data) {
    const allowedFields = [
      "categoryId",
      "name",
      "description",
      "city",
      "address",
      "latitude",
      "longitude",
      "referencePrice",
      "schedule",
      "contactPhone",
      "contactEmail"
    ];

    if (!allowedFields.some((field) => data[field] !== undefined)) {
      throw new AppError("At least one activity field is required", 400);
    }

    if (data.categoryId !== undefined) this.categoryId = normalizeCategoryId(data.categoryId);
    if (data.name !== undefined) this.name = normalizeActivityName(data.name);
    if (data.description !== undefined) this.description = normalizeActivityDescription(data.description);
    if (data.city !== undefined) this.city = normalizeCity(data.city);
    if (data.address !== undefined) this.address = normalizeOptionalText(data.address, "Address", 200);
    if (data.latitude !== undefined) this.latitude = normalizeCoordinate(data.latitude, "Latitude", -90, 90);
    if (data.longitude !== undefined) this.longitude = normalizeCoordinate(data.longitude, "Longitude", -180, 180);
    if (data.referencePrice !== undefined) this.referencePrice = normalizeReferencePrice(data.referencePrice);
    if (data.schedule !== undefined) this.schedule = normalizeOptionalText(data.schedule, "Schedule", 150);
    if (data.contactPhone !== undefined) this.contactPhone = normalizeContactPhone(data.contactPhone);
    if (data.contactEmail !== undefined) this.contactEmail = normalizeContactEmail(data.contactEmail);
  }
}

module.exports = UpdateActivityDto;
