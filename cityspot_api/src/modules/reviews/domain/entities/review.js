class Review {
  constructor({
    id,
    activityId,
    userId,
    ownerId,
    rating,
    comment,
    ownerRead,
    createdAt,
    activityName,
    userName,
    userEmail
  }) {
    this.id = id;
    this.activityId = activityId;
    this.userId = userId;
    this.ownerId = ownerId;
    this.rating = rating;
    this.comment = comment;
    this.ownerRead = ownerRead;
    this.createdAt = createdAt;
    this.activityName = activityName;
    this.userName = userName;
    this.userEmail = userEmail;
  }
}

module.exports = Review;
