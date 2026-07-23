const ActivitySequelizeRepository = require("../../../activities/infrastructure/persistence/sequelize/activitySequelizeRepository");
const CountOwnerUnreadReviewsUseCase = require("../../application/use-cases/countOwnerUnreadReviews");
const CreateReviewUseCase = require("../../application/use-cases/createReview");
const ListActivityReviewsUseCase = require("../../application/use-cases/listActivityReviews");
const ListOwnerReviewsUseCase = require("../../application/use-cases/listOwnerReviews");
const MarkOwnerReviewsReadUseCase = require("../../application/use-cases/markOwnerReviewsRead");
const ReviewSequelizeRepository = require("../persistence/sequelize/reviewSequelizeRepository");

const reviewRepository = new ReviewSequelizeRepository();
const activityRepository = new ActivitySequelizeRepository();
const createReview = new CreateReviewUseCase(reviewRepository, activityRepository);
const listActivityReviews = new ListActivityReviewsUseCase(reviewRepository);
const listOwnerReviews = new ListOwnerReviewsUseCase(reviewRepository);
const countOwnerUnreadReviews = new CountOwnerUnreadReviewsUseCase(reviewRepository);
const markOwnerReviewsRead = new MarkOwnerReviewsReadUseCase(reviewRepository);

class ReviewController {
  async create(req, res) {
    const review = await createReview.execute(req.user.id, req.params.activityId, req.body);

    res.status(201).json({
      message: "Review created successfully",
      review
    });
  }

  async listByActivity(req, res) {
    const reviews = await listActivityReviews.execute(req.params.activityId);

    res.status(200).json({ reviews });
  }

  async listOwner(req, res) {
    const reviews = await listOwnerReviews.execute(req.user.id);

    res.status(200).json({ reviews });
  }

  async ownerUnreadCount(req, res) {
    const unreadCount = await countOwnerUnreadReviews.execute(req.user.id);

    res.status(200).json({ unreadCount });
  }

  async markOwnerAsRead(req, res) {
    const updatedCount = await markOwnerReviewsRead.execute(req.user.id);

    res.status(200).json({
      message: "Reviews marked as read",
      updatedCount
    });
  }
}

module.exports = new ReviewController();
