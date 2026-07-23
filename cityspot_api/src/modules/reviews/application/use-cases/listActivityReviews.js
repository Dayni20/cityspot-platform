const ReviewMapper = require("../mappers/reviewMapper");

class ListActivityReviewsUseCase {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async execute(activityId) {
    const reviews = await this.reviewRepository.findByActivityId(activityId);
    return reviews.map(ReviewMapper.toResponse);
  }
}

module.exports = ListActivityReviewsUseCase;
