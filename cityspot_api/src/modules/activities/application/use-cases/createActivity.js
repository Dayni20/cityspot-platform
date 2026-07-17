const AppError = require("../../../../shared/errors/AppError");
const ActivityMapper = require("../mappers/activityMapper");

class CreateActivityUseCase {
  constructor(activityRepository, categoryRepository) {
    this.activityRepository = activityRepository;
    this.categoryRepository = categoryRepository;
  }

  async execute(ownerId, activityData) {
    const category = await this.categoryRepository.findById(activityData.categoryId);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    const activity = await this.activityRepository.create({
      ...activityData,
      ownerId,
      status: "PENDIENTE"
    });

    return ActivityMapper.toResponse(activity);
  }
}

module.exports = CreateActivityUseCase;
