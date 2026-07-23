const AppError = require("../../../../shared/errors/AppError");
const { normalizeActivityId } = require("../../../../shared/validators/activityValidator");
const { normalizeRating, normalizeReviewComment } = require("../../../../shared/validators/reviewValidator");
const ReviewMapper = require("../mappers/reviewMapper");

class CreateReviewUseCase {
  constructor(reviewRepository, activityRepository) {
    this.reviewRepository = reviewRepository;
    this.activityRepository = activityRepository;
  }

  async execute(userId, activityId, data) {
    const id = normalizeActivityId(activityId);
    const rating = normalizeRating(data.rating);
    const comment = normalizeReviewComment(data.comment);
    const activity = await this.activityRepository.findById(id);

    if (!activity || activity.status !== "ACTIVA") {
      throw new AppError("Activity not found", 404);
    }

    if (activity.ownerId === userId) {
      throw new AppError("Owner cannot review their own activity", 409);
    }

    const existingReview = await this.reviewRepository.findByUserAndActivity(userId, id);

    if (existingReview) {
      throw new AppError("You already reviewed this activity", 409);
    }

    const review = await this.reviewRepository.create({
      activityId: id,
      userId,
      ownerId: activity.ownerId,
      rating,
      comment,
      ownerRead: false
    });

    return ReviewMapper.toResponse(review);
  }
}

module.exports = CreateReviewUseCase;
