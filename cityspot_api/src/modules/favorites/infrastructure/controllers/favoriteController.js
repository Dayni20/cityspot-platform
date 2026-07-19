const FavoriteSequelizeRepository = require("../persistence/sequelize/favoriteSequelizeRepository");
const ActivitySequelizeRepository = require("../../../activities/infrastructure/persistence/sequelize/activitySequelizeRepository");
const AddFavoriteUseCase = require("../../application/use-cases/addFavorite");
const ListFavoritesUseCase = require("../../application/use-cases/listFavorites");
const RemoveFavoriteUseCase = require("../../application/use-cases/removeFavorite");

const favoriteRepository = new FavoriteSequelizeRepository();
const activityRepository = new ActivitySequelizeRepository();
const addFavorite = new AddFavoriteUseCase(favoriteRepository, activityRepository);
const listFavorites = new ListFavoritesUseCase(favoriteRepository);
const removeFavorite = new RemoveFavoriteUseCase(favoriteRepository);

class FavoriteController {
  async add(req, res) {
    const favorite = await addFavorite.execute(req.user.id, req.params.activityId);

    res.status(201).json({
      message: "Activity added to favorites successfully",
      favorite
    });
  }

  async list(req, res) {
    const favorites = await listFavorites.execute(req.user.id);

    res.status(200).json({ favorites });
  }

  async remove(req, res) {
    await removeFavorite.execute(req.user.id, req.params.activityId);

    res.status(200).json({
      message: "Activity removed from favorites successfully"
    });
  }
}

module.exports = new FavoriteController();
