class MarkOwnerReviewsReadUseCase {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async execute(ownerId) {
    return this.reviewRepository.markAsReadByOwnerId(ownerId);
  }
}

module.exports = MarkOwnerReviewsReadUseCase;
