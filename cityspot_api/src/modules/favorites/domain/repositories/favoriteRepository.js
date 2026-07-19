class FavoriteRepository {
  async create(favoriteData) {
    throw new Error("Method not implemented");
  }

  async findByUserId(userId) {
    throw new Error("Method not implemented");
  }

  async findByUserAndActivity(userId, activityId) {
    throw new Error("Method not implemented");
  }

  async deleteByUserAndActivity(userId, activityId) {
    throw new Error("Method not implemented");
  }
}

module.exports = FavoriteRepository;
