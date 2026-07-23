const { Router } = require("express");
const inquiryController = require("../controllers/inquiryController");
const { authenticate, authorizeRoles } = require("../../../../shared/middlewares/auth");
const asyncHandler = require("../../../../shared/utils/asyncHandler");

const router = Router({ mergeParams: true });
const onlyUser = [authenticate, authorizeRoles("USUARIO")];
const onlyOwner = [authenticate, authorizeRoles("PROPIETARIO")];

router.post("/activities/:activityId/inquiries", onlyUser, asyncHandler(inquiryController.create));
router.get("/inquiries/mine/unread-count", onlyUser, asyncHandler(inquiryController.userUnreadCount));
router.patch("/inquiries/mine/read", onlyUser, asyncHandler(inquiryController.markMineAsRead));
router.get("/inquiries/mine", onlyUser, asyncHandler(inquiryController.listMine));
router.get("/inquiries/owner/pending-count", onlyOwner, asyncHandler(inquiryController.ownerPendingCount));
router.get("/inquiries/owner", onlyOwner, asyncHandler(inquiryController.listOwner));
router.patch("/inquiries/:id/answer", onlyOwner, asyncHandler(inquiryController.answer));

module.exports = router;
