class Activity {
  constructor({
    id,
    ownerId,
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
    contactEmail,
    status,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.ownerId = ownerId;
    this.categoryId = categoryId;
    this.name = name;
    this.description = description;
    this.city = city;
    this.address = address;
    this.latitude = latitude;
    this.longitude = longitude;
    this.referencePrice = referencePrice;
    this.schedule = schedule;
    this.contactPhone = contactPhone;
    this.contactEmail = contactEmail;
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  belongsTo(ownerId) {
    return this.ownerId === ownerId;
  }
}

module.exports = Activity;
