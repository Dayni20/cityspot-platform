const AppError = require("../../../../shared/errors/AppError");
const { normalizeActivityId } = require("../../../../shared/validators/activityValidator");

class DeleteActivityImageUseCase {
  constructor(activityRepository, imageRepository, storageService) {
    this.activityRepository = activityRepository;
    this.imageRepository = imageRepository;
    this.storageService = storageService;
  }

  async execute(activityId, imageId, user) {
    const id = normalizeActivityId(activityId);
    const activity = await this.activityRepository.findById(id);

    if (!activity) {
      throw new AppError("Activity not found", 404);
    }

    if (user.role !== "ADMINISTRADOR" && !activity.belongsTo(user.id)) {
      throw new AppError("You can only delete images from your own activities", 403);
    }

    const image = await this.imageRepository.findById(normalizeActivityId(imageId));

    if (!image || image.activityId !== id) {
      throw new AppError("Image not found", 404);
    }

    await this.storageService.deletePublicImage(image.imageUrl);
    await this.imageRepository.delete(image.id);
  }
}

module.exports = DeleteActivityImageUseCase;
