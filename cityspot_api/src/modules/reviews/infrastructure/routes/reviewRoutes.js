const { Router } = require("express");
const reviewController = require("../controllers/reviewController");
const { authenticate, authorizeRoles } = require("../../../../shared/middlewares/auth");
const asyncHandler = require("../../../../shared/utils/asyncHandler");

const router = Router();
const onlyUser = [authenticate, authorizeRoles("USUARIO")];
const onlyOwner = [authenticate, authorizeRoles("PROPIETARIO")];

router.post("/activities/:activityId/reviews", onlyUser, asyncHandler(reviewController.create));
router.get("/activities/:activityId/reviews", asyncHandler(reviewController.listByActivity));
router.get("/reviews/owner", onlyOwner, asyncHandler(reviewController.listOwner));
router.get("/reviews/owner/unread-count", onlyOwner, asyncHandler(reviewController.ownerUnreadCount));
router.patch("/reviews/owner/read", onlyOwner, asyncHandler(reviewController.markOwnerAsRead));

module.exports = router;
