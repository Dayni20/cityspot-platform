const UploadImageDto = require("../../application/dtos/uploadImage");
const ActivitySequelizeRepository = require("../../../activities/infrastructure/persistence/sequelize/activitySequelizeRepository");
const ImageSequelizeRepository = require("../persistence/sequelize/imageSequelizeRepository");
const SupabaseStorageService = require("../storage/supabaseStorageService");
const UploadActivityImageUseCase = require("../../application/use-cases/uploadActivityImage");
const ListActivityImagesUseCase = require("../../application/use-cases/listActivityImages");
const SetMainActivityImageUseCase = require("../../application/use-cases/setMainActivityImage");
const DeleteActivityImageUseCase = require("../../application/use-cases/deleteActivityImage");

const activityRepository = new ActivitySequelizeRepository();
const imageRepository = new ImageSequelizeRepository();
const storageService = new SupabaseStorageService();
const uploadActivityImage = new UploadActivityImageUseCase(
  activityRepository,
  imageRepository,
  storageService
);
const listActivityImages = new ListActivityImagesUseCase(activityRepository, imageRepository);
const setMainActivityImage = new SetMainActivityImageUseCase(activityRepository, imageRepository);
const deleteActivityImage = new DeleteActivityImageUseCase(
  activityRepository,
  imageRepository,
  storageService
);

class ImageController {
  async upload(req, res) {
    const dto = new UploadImageDto(req.body, req.file);
    const image = await uploadActivityImage.execute(req.params.activityId, req.user, dto);

    res.status(201).json({
      message: "Image uploaded successfully",
      image
    });
  }

  async listByActivity(req, res) {
    const images = await listActivityImages.execute(req.params.activityId);

    res.status(200).json({ images });
  }

  async setMain(req, res) {
    const image = await setMainActivityImage.execute(
      req.params.activityId,
      req.params.imageId,
      req.user
    );

    res.status(200).json({
      message: "Main image updated successfully",
      image
    });
  }

  async delete(req, res) {
    await deleteActivityImage.execute(req.params.activityId, req.params.imageId, req.user);

    res.status(200).json({
      message: "Image deleted successfully"
    });
  }
}

module.exports = new ImageController();
