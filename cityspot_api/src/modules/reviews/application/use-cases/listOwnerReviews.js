const ReviewMapper = require("../mappers/reviewMapper");

class ListOwnerReviewsUseCase {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async execute(ownerId) {
    const reviews = await this.reviewRepository.findByOwnerId(ownerId);
    return reviews.map(ReviewMapper.toResponse);
  }
}

module.exports = ListOwnerReviewsUseCase;
