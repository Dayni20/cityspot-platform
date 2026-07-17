const AppError = require("../../../../shared/errors/AppError");
const { normalizeActivityId } = require("../../../../shared/validators/activityValidator");
const ActivityMapper = require("../mappers/activityMapper");

class UpdateActivityStatusUseCase {
  constructor(activityRepository) {
    this.activityRepository = activityRepository;
  }

  async execute(id, status) {
    const activity = await this.activityRepository.updateStatus(normalizeActivityId(id), status);

    if (!activity) {
      throw new AppError("Activity not found", 404);
    }

    return ActivityMapper.toResponse(activity);
  }
}

module.exports = UpdateActivityStatusUseCase;
