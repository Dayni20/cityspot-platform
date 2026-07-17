const ActivityMapper = require("../mappers/activityMapper");

class ListOwnerActivitiesUseCase {
  constructor(activityRepository) {
    this.activityRepository = activityRepository;
  }

  async execute(ownerId) {
    const activities = await this.activityRepository.findByOwnerId(ownerId);
    return activities.map(ActivityMapper.toResponse);
  }
}

module.exports = ListOwnerActivitiesUseCase;
