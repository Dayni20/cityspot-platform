class ReviewMapper {
  static toResponse(review) {
    return {
      id: review.id,
      activityId: review.activityId,
      userId: review.userId,
      ownerId: review.ownerId,
      rating: review.rating,
      comment: review.comment,
      ownerRead: review.ownerRead,
      createdAt: review.createdAt,
      activityName: review.activityName,
      userName: review.userName,
      userEmail: review.userEmail
    };
  }
}

module.exports = ReviewMapper;
