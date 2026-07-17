const { Router } = require("express");
const imageController = require("../controllers/imageController");
const uploadImage = require("../middlewares/uploadImage");
const { authenticate, authorizeRoles } = require("../../../../shared/middlewares/auth");
const asyncHandler = require("../../../../shared/utils/asyncHandler");

const router = Router({ mergeParams: true });
const ownerOrAdmin = [authenticate, authorizeRoles("PROPIETARIO", "ADMINISTRADOR")];

router.get("/", asyncHandler(imageController.listByActivity));
router.post("/", ownerOrAdmin, uploadImage.single("image"), asyncHandler(imageController.upload));
router.patch("/:imageId/main", ownerOrAdmin, asyncHandler(imageController.setMain));
router.delete("/:imageId", ownerOrAdmin, asyncHandler(imageController.delete));

module.exports = router;
