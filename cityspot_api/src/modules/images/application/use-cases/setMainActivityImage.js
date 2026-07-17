const AppError = require("../../../../shared/errors/AppError");
const { normalizeActivityId } = require("../../../../shared/validators/activityValidator");
const ImageMapper = require("../mappers/imageMapper");

class SetMainActivityImageUseCase {
  constructor(activityRepository, imageRepository) {
    this.activityRepository = activityRepository;
    this.imageRepository = imageRepository;
  }

  async execute(activityId, imageId, user) {
    const id = normalizeActivityId(activityId);
    const activity = await this.activityRepository.findById(id);

    if (!activity) {
      throw new AppError("Activity not found", 404);
    }

    if (user.role !== "ADMINISTRADOR" && !activity.belongsTo(user.id)) {
      throw new AppError("You can only update images from your own activities", 403);
    }

    const image = await this.imageRepository.setMain(id, normalizeActivityId(imageId));

    if (!image) {
      throw new AppError("Image not found", 404);
    }

    return ImageMapper.toResponse(image);
  }
}

module.exports = SetMainActivityImageUseCase;
