const sequelize = require("../../../../../shared/database/postgresql/sequelize");
const ImageRepository = require("../../../domain/repositories/imageRepository");
const Image = require("../../../domain/entities/image");
const ImageModel = require("./imageModel");

class ImageSequelizeRepository extends ImageRepository {
  async create(imageData) {
    const image = await sequelize.transaction(async (transaction) => {
      if (imageData.isMain) {
        await ImageModel.update(
          { isMain: false },
          { where: { activityId: imageData.activityId }, transaction }
        );
      }

      return ImageModel.create(imageData, { transaction });
    });

    return this.toEntity(image);
  }

  async findById(id) {
    const image = await ImageModel.findByPk(id);
    return this.toEntity(image);
  }

  async findByActivityId(activityId) {
    const images = await ImageModel.findAll({
      where: { activityId },
      order: [
        ["isMain", "DESC"],
        ["id", "ASC"]
      ]
    });

    return images.map((image) => this.toEntity(image));
  }

  async setMain(activityId, imageId) {
    const image = await sequelize.transaction(async (transaction) => {
      const targetImage = await ImageModel.findOne({
        where: { id: imageId, activityId },
        transaction
      });

      if (!targetImage) {
        return null;
      }

      await ImageModel.update({ isMain: false }, { where: { activityId }, transaction });
      await targetImage.update({ isMain: true }, { transaction });

      return targetImage;
    });

    return this.toEntity(image);
  }

  async delete(id) {
    const deletedRows = await ImageModel.destroy({ where: { id } });
    return deletedRows > 0;
  }

  toEntity(imageModel) {
    if (!imageModel) {
      return null;
    }

    return new Image(imageModel.get({ plain: true }));
  }
}

module.exports = ImageSequelizeRepository;
