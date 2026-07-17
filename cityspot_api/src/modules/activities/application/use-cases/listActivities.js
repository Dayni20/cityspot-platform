const { normalizeCategoryId } = require("../../../../shared/validators/activityValidator");
const ActivityMapper = require("../mappers/activityMapper");

class ListActivitiesUseCase {
  constructor(activityRepository) {
    this.activityRepository = activityRepository;
  }

  async execute(query) {
    const filters = {
      status: "ACTIVA"
    };

    if (query.city) {
      filters.city = String(query.city).trim();
    }

    if (query.categoryId) {
      filters.categoryId = normalizeCategoryId(query.categoryId);
    }

    const activities = await this.activityRepository.findAll(filters);
    return activities.map(ActivityMapper.toResponse);
  }
}

module.exports = ListActivitiesUseCase;
