const AppError = require("../../../../shared/errors/AppError");
const { normalizeActivityId } = require("../../../../shared/validators/activityValidator");
const ActivityMapper = require("../mappers/activityMapper");

class UpdateActivityUseCase {
  constructor(activityRepository, categoryRepository) {
    this.activityRepository = activityRepository;
    this.categoryRepository = categoryRepository;
  }

  async execute(id, ownerId, activityData) {
    const activityId = normalizeActivityId(id);
    const activity = await this.activityRepository.findById(activityId);

    if (!activity) {
      throw new AppError("Activity not found", 404);
    }

    if (!activity.belongsTo(ownerId)) {
      throw new AppError("You can only update your own activities", 403);
    }

    if (activityData.categoryId) {
      const category = await this.categoryRepository.findById(activityData.categoryId);

      if (!category) {
        throw new AppError("Category not found", 404);
      }
    }

    const updatedActivity = await this.activityRepository.update(activityId, activityData);
    return ActivityMapper.toResponse(updatedActivity);
  }
}

module.exports = UpdateActivityUseCase;
