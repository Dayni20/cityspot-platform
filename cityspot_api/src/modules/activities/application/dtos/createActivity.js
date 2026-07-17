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

class CreateActivityDto {
  constructor({
    categoryId,
    name,
    description,
    city,
    address,
    latitude,
    longitude,
    referencePrice,
    schedule,
    contactPhone,
    contactEmail
  }) {
    this.categoryId = normalizeCategoryId(categoryId);
    this.name = normalizeActivityName(name);
    this.description = normalizeActivityDescription(description);
    this.city = normalizeCity(city);
    this.address = normalizeOptionalText(address, "Address", 200);
    this.latitude = normalizeCoordinate(latitude, "Latitude", -90, 90);
    this.longitude = normalizeCoordinate(longitude, "Longitude", -180, 180);
    this.referencePrice = normalizeReferencePrice(referencePrice);
    this.schedule = normalizeOptionalText(schedule, "Schedule", 150);
    this.contactPhone = normalizeContactPhone(contactPhone);
    this.contactEmail = normalizeContactEmail(contactEmail);
  }
}

module.exports = CreateActivityDto;
