class ReviewRepository {
  async create() {
    throw new Error("Method create is not implemented");
  }

  async findByActivityId() {
    throw new Error("Method findByActivityId is not implemented");
  }

  async findByUserAndActivity() {
    throw new Error("Method findByUserAndActivity is not implemented");
  }

  async findByOwnerId() {
    throw new Error("Method findByOwnerId is not implemented");
  }

  async countUnreadByOwnerId() {
    throw new Error("Method countUnreadByOwnerId is not implemented");
  }

  async markAsReadByOwnerId() {
    throw new Error("Method markAsReadByOwnerId is not implemented");
  }
}

module.exports = ReviewRepository;
