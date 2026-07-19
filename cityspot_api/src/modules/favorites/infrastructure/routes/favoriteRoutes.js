const { Router } = require("express");
const favoriteController = require("../controllers/favoriteController");
const { authenticate, authorizeRoles } = require("../../../../shared/middlewares/auth");
const asyncHandler = require("../../../../shared/utils/asyncHandler");

const router = Router();
const onlyUser = [authenticate, authorizeRoles("USUARIO")];

router.get("/", onlyUser, asyncHandler(favoriteController.list));
router.post("/:activityId", onlyUser, asyncHandler(favoriteController.add));
router.delete("/:activityId", onlyUser, asyncHandler(favoriteController.remove));

module.exports = router;
