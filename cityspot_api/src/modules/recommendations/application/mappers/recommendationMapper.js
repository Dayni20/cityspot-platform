function toResponse(recommendation) {
  return {
    activityId: recommendation.activity.id,
    name: recommendation.activity.name,
    description: recommendation.activity.description,
    city: recommendation.activity.city,
    address: recommendation.activity.address,
    category: recommendation.activity.category,
    referencePrice: recommendation.activity.referencePrice,
    schedule: recommendation.activity.schedule,
    contactPhone: recommendation.activity.contactPhone,
    contactEmail: recommendation.activity.contactEmail,
    reason: recommendation.reason
  };
}

module.exports = {
  toResponse
};
