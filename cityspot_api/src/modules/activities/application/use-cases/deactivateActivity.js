const AppError = require("../../../../shared/errors/AppError");
const { normalizeActivityId } = require("../../../../shared/validators/activityValidator");
const ActivityMapper = require("../mappers/activityMapper");

class DeactivateActivityUseCase {
  constructor(activityRepository) {
    this.activityRepository = activityRepository;
  }

  async execute(id, user) {
    const activityId = normalizeActivityId(id);
    const activity = await this.activityRepository.findById(activityId);

    if (!activity) {
      throw new AppError("Activity not found", 404);
    }

    if (user.role !== "ADMINISTRADOR" && !activity.belongsTo(user.id)) {
      throw new AppError("You can only deactivate your own activities", 403);
    }

    const deactivatedActivity = await this.activityRepository.updateStatus(activityId, "INACTIVA");
    return ActivityMapper.toResponse(deactivatedActivity);
  }
}

module.exports = DeactivateActivityUseCase;
