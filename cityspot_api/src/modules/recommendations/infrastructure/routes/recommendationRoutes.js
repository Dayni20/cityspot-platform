const { Router } = require("express");
const recommendationController = require("../controllers/recommendationController");
const { authenticate, authorizeRoles } = require("../../../../shared/middlewares/auth");
const asyncHandler = require("../../../../shared/utils/asyncHandler");

const router = Router();
const onlyUser = [authenticate, authorizeRoles("USUARIO")];

router.post("/", onlyUser, asyncHandler(recommendationController.generate));

module.exports = router;
