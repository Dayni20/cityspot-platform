const { Router } = require("express");
const userController = require("../controllers/userController");
const { authenticate } = require("../../../../shared/middlewares/auth");
const asyncHandler = require("../../../../shared/utils/asyncHandler");

const router = Router();

router.post("/register", asyncHandler(userController.register));
router.post("/login", asyncHandler(userController.login));
router.get("/profile", authenticate, asyncHandler(userController.getProfile));
router.put("/profile", authenticate, asyncHandler(userController.updateProfile));
router.delete("/profile", authenticate, asyncHandler(userController.deactivateProfile));

module.exports = router;
