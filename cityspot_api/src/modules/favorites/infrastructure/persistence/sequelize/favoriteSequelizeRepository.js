const FavoriteRepository = require("../../../domain/repositories/favoriteRepository");
const Favorite = require("../../../domain/entities/favorite");
const Activity = require("../../../../activities/domain/entities/activity");
const FavoriteModel = require("./favoriteModel");
const ActivityModel = require("../../../../activities/infrastructure/persistence/sequelize/activityModel");

FavoriteModel.belongsTo(ActivityModel, {
  foreignKey: "activityId",
  targetKey: "id",
  as: "activity"
});

class FavoriteSequelizeRepository extends FavoriteRepository {
  async create(favoriteData) {
    const favorite = await FavoriteModel.create(favoriteData);
    return this.findByUserAndActivity(favorite.userId, favorite.activityId);
  }

  async findByUserId(userId) {
    const favorites = await FavoriteModel.findAll({
      where: { userId },
      include: [{ model: ActivityModel, as: "activity" }],
      order: [["savedAt", "DESC"]]
    });

    return favorites.map((favorite) => this.toEntity(favorite));
  }

  async findByUserAndActivity(userId, activityId) {
    const favorite = await FavoriteModel.findOne({
      where: { userId, activityId },
      include: [{ model: ActivityModel, as: "activity" }]
    });

    return this.toEntity(favorite);
  }

  async deleteByUserAndActivity(userId, activityId) {
    const deletedRows = await FavoriteModel.destroy({ where: { userId, activityId } });
    return deletedRows > 0;
  }

  toEntity(favoriteModel) {
    if (!favoriteModel) {
      return null;
    }

    const favorite = favoriteModel.get({ plain: true });

    return new Favorite({
      ...favorite,
      activity: favorite.activity ? new Activity(favorite.activity) : null
    });
  }
}

module.exports = FavoriteSequelizeRepository;
