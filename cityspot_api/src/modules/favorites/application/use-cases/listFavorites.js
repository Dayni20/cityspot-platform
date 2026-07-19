const FavoriteMapper = require("../mappers/favoriteMapper");

class ListFavoritesUseCase {
  constructor(favoriteRepository) {
    this.favoriteRepository = favoriteRepository;
  }

  async execute(userId) {
    const favorites = await this.favoriteRepository.findByUserId(userId);
    return favorites.map(FavoriteMapper.toResponse);
  }
}

module.exports = ListFavoritesUseCase;
