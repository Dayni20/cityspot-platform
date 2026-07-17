const { Router } = require("express");
const categoryController = require("../controllers/categoryController");
const { authenticate, authorizeRoles } = require("../../../../shared/middlewares/auth");
const asyncHandler = require("../../../../shared/utils/asyncHandler");

const router = Router();
const onlyAdmin = [authenticate, authorizeRoles("ADMINISTRADOR")];

router.get("/", asyncHandler(categoryController.list));
router.get("/:id", asyncHandler(categoryController.getById));
router.post("/", onlyAdmin, asyncHandler(categoryController.create));
router.patch("/:id", onlyAdmin, asyncHandler(categoryController.update));
router.delete("/:id", onlyAdmin, asyncHandler(categoryController.delete));

module.exports = router;
