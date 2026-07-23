class CountOwnerUnreadReviewsUseCase {
  constructor(reviewRepository) {
    this.reviewRepository = reviewRepository;
  }

  async execute(ownerId) {
    return this.reviewRepository.countUnreadByOwnerId(ownerId);
  }
}

module.exports = CountOwnerUnreadReviewsUseCase;
