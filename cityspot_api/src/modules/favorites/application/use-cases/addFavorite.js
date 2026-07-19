const AppError = require("../../../../shared/errors/AppError");
const { normalizeActivityId } = require("../../../../shared/validators/activityValidator");
const FavoriteMapper = require("../mappers/favoriteMapper");

class AddFavoriteUseCase {
  constructor(favoriteRepository, activityRepository) {
    this.favoriteRepository = favoriteRepository;
    this.activityRepository = activityRepository;
  }

  async execute(userId, activityId) {
    const id = normalizeActivityId(activityId);
    const activity = await this.activityRepository.findById(id);

    if (!activity || activity.status !== "ACTIVA") {
      throw new AppError("Activity not found", 404);
    }

    const existingFavorite = await this.favoriteRepository.findByUserAndActivity(userId, id);

    if (existingFavorite) {
      throw new AppError("Activity is already in favorites", 409);
    }

    const favorite = await this.favoriteRepository.create({ userId, activityId: id });
    return FavoriteMapper.toResponse(favorite);
  }
}

module.exports = AddFavoriteUseCase;
