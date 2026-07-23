const AppError = require("../errors/AppError");

function normalizeReviewId(id) {
  const reviewId = Number(id);

  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    throw new AppError("Review id is invalid", 400);
  }

  return reviewId;
}

function normalizeRating(rating) {
  const value = Number(rating);

  if (!Number.isInteger(value) || value < 1 || value > 5) {
    throw new AppError("Rating must be an integer between 1 and 5", 400);
  }

  return value;
}

function normalizeReviewComment(comment) {
  if (!comment || !String(comment).trim()) {
    throw new AppError("Comment is required", 400);
  }

  const normalizedComment = String(comment).trim().replace(/\s+/g, " ");

  if (normalizedComment.length < 5 || normalizedComment.length > 500) {
    throw new AppError("Comment must be between 5 and 500 characters", 400);
  }

  return normalizedComment;
}

module.exports = {
  normalizeReviewId,
  normalizeRating,
  normalizeReviewComment
};
