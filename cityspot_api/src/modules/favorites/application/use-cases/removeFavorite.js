const AppError = require("../../../../shared/errors/AppError");
const { normalizeActivityId } = require("../../../../shared/validators/activityValidator");

class RemoveFavoriteUseCase {
  constructor(favoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  async execute(userId, activityId) {
    const deleted = await this.favoriteRepository.deleteByUserAndActivity(
      userId,
      normalizeActivityId(activityId)
    );

    if (!deleted) {
      throw new AppError("Favorite not found", 404);
    }
  }
}

module.exports = RemoveFavoriteUseCase;
