const AppError = require("../../../../shared/errors/AppError");
const { normalizeActivityId } = require("../../../../shared/validators/activityValidator");
const ActivityMapper = require("../mappers/activityMapper");

class GetActivityUseCase {
  constructor(activityRepository) {
    this.activityRepository = activityRepository;
  }

  async execute(id) {
    const activity = await this.activityRepository.findById(normalizeActivityId(id));

    if (!activity || activity.status !== "ACTIVA") {
      throw new AppError("Activity not found", 404);
    }

    return ActivityMapper.toResponse(activity);
  }
}

module.exports = GetActivityUseCase;
