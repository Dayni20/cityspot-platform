const AppError = require("../../../../shared/errors/AppError");
const { normalizeActivityId } = require("../../../../shared/validators/activityValidator");
const ImageMapper = require("../mappers/imageMapper");

class UploadActivityImageUseCase {
  constructor(activityRepository, imageRepository, storageService) {
    this.activityRepository = activityRepository;
    this.imageRepository = imageRepository;
    this.storageService = storageService;
  }

  async execute(activityId, user, imageData) {
    const id = normalizeActivityId(activityId);
    const activity = await this.activityRepository.findById(id);

    if (!activity) {
      throw new AppError("Activity not found", 404);
    }

    if (user.role !== "ADMINISTRADOR" && !activity.belongsTo(user.id)) {
      throw new AppError("You can only upload images to your own activities", 403);
    }

    const currentImages = await this.imageRepository.findByActivityId(id);
    const uploadedImage = await this.storageService.uploadActivityImage(id, imageData.file);
    const image = await this.imageRepository.create({
      activityId: id,
      imageUrl: uploadedImage.publicUrl,
      description: imageData.description,
      isMain: imageData.isMain || currentImages.length === 0
    });

    return ImageMapper.toResponse(image);
  }
}

module.exports = UploadActivityImageUseCase;
