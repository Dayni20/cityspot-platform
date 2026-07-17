class ActivityMapper {
  static toResponse(activity) {
    return {
      id: activity.id,
      ownerId: activity.ownerId,
      categoryId: activity.categoryId,
      name: activity.name,
      description: activity.description,
      city: activity.city,
      address: activity.address,
      latitude: activity.latitude === null ? null : Number(activity.latitude),
      longitude: activity.longitude === null ? null : Number(activity.longitude),
      referencePrice: activity.referencePrice === null ? null : Number(activity.referencePrice),
      schedule: activity.schedule,
      contactPhone: activity.contactPhone,
      contactEmail: activity.contactEmail,
      status: activity.status,
      createdAt: activity.createdAt,
      updatedAt: activity.updatedAt
    };
  }
}

module.exports = ActivityMapper;
