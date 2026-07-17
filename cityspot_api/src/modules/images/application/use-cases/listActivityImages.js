const AppError = require("../../../../shared/errors/AppError");
const { normalizeActivityId } = require("../../../../shared/validators/activityValidator");
const ImageMapper = require("../mappers/imageMapper");

class ListActivityImagesUseCase {
  constructor(activityRepository, imageRepository) {
    this.activityRepository = activityRepository;
    this.imageRepository = imageRepository;
  }

  async execute(activityId) {
    const id = normalizeActivityId(activityId);
    const activity = await this.activityRepository.findById(id);

    if (!activity) {
      throw new AppError("Activity not found", 404);
    }

    const images = await this.imageRepository.findByActivityId(id);
    return images.map(ImageMapper.toResponse);
  }
}

module.exports = ListActivityImagesUseCase;
