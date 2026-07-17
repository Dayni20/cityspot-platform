const { Router } = require("express");
const activityController = require("../controllers/activityController");
const { authenticate, authorizeRoles } = require("../../../../shared/middlewares/auth");
const asyncHandler = require("../../../../shared/utils/asyncHandler");

const router = Router();
const onlyOwner = [authenticate, authorizeRoles("PROPIETARIO")];
const onlyAdmin = [authenticate, authorizeRoles("ADMINISTRADOR")];
const ownerOrAdmin = [authenticate, authorizeRoles("PROPIETARIO", "ADMINISTRADOR")];

router.get("/", asyncHandler(activityController.list));
router.get("/mine", onlyOwner, asyncHandler(activityController.listMine));
router.get("/:id", asyncHandler(activityController.getById));
router.post("/", onlyOwner, asyncHandler(activityController.create));
router.patch("/:id", onlyOwner, asyncHandler(activityController.update));
router.patch("/:id/status", onlyAdmin, asyncHandler(activityController.updateStatus));
router.delete("/:id", ownerOrAdmin, asyncHandler(activityController.deactivate));

module.exports = router;
