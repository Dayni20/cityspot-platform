const ActivityMapper = require("../mappers/activityMapper");

class ListAdminActivitiesUseCase {
  constructor(activityRepository) {
    this.activityRepository = activityRepository;
  }

  async execute() {
    const activities = await this.activityRepository.findAll();
    return activities.map(ActivityMapper.toResponse);
  }
}

module.exports = ListAdminActivitiesUseCase;
