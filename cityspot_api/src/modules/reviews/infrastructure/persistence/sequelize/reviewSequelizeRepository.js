const Review = require("../../../domain/entities/review");
const ReviewRepository = require("../../../domain/repositories/reviewRepository");
const ActivityModel = require("../../../../activities/infrastructure/persistence/sequelize/activityModel");
const UserModel = require("../../../../users/infrastructure/persistence/sequelize/userModel");
const ReviewModel = require("./reviewModel");

class ReviewSequelizeRepository extends ReviewRepository {
  async create(reviewData) {
    const review = await ReviewModel.create(reviewData);
    return this.toEntityWithDetails(review);
  }

  async findByActivityId(activityId) {
    const reviews = await ReviewModel.findAll({
      where: { activityId },
      order: [["createdAt", "DESC"]]
    });

    return Promise.all(reviews.map((review) => this.toEntityWithDetails(review)));
  }

  async findByUserAndActivity(userId, activityId) {
    const review = await ReviewModel.findOne({
      where: { userId, activityId }
    });

    return this.toEntity(review);
  }

  async findByOwnerId(ownerId) {
    const reviews = await ReviewModel.findAll({
      where: { ownerId },
      order: [["createdAt", "DESC"]]
    });

    return Promise.all(reviews.map((review) => this.toEntityWithDetails(review)));
  }

  async countUnreadByOwnerId(ownerId) {
    return ReviewModel.count({
      where: { ownerId, ownerRead: false }
    });
  }

  async markAsReadByOwnerId(ownerId) {
    const [updatedCount] = await ReviewModel.update(
      { ownerRead: true },
      { where: { ownerId, ownerRead: false } }
    );

    return updatedCount;
  }

  async toEntityWithDetails(reviewModel) {
    if (!reviewModel) {
      return null;
    }

    const review = reviewModel.get({ plain: true });
    const [activity, user] = await Promise.all([
      ActivityModel.findByPk(review.activityId),
      UserModel.findByPk(review.userId)
    ]);

    return new Review({
      ...review,
      activityName: activity?.name || null,
      userName: user?.name || null,
      userEmail: user?.email || null
    });
  }

  toEntity(reviewModel) {
    if (!reviewModel) {
      return null;
    }

    return new Review(reviewModel.get({ plain: true }));
  }
}

module.exports = ReviewSequelizeRepository;
