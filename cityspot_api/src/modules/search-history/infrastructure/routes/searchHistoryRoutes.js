const { Router } = require("express");
const searchHistoryController = require("../controllers/searchHistoryController");
const { authenticate, authorizeRoles } = require("../../../../shared/middlewares/auth");
const asyncHandler = require("../../../../shared/utils/asyncHandler");

const router = Router();
const onlyUser = [authenticate, authorizeRoles("USUARIO")];

router.get("/", onlyUser, asyncHandler(searchHistoryController.list));
router.get("/count", onlyUser, asyncHandler(searchHistoryController.count));
router.post("/", onlyUser, asyncHandler(searchHistoryController.save));
router.delete("/", onlyUser, asyncHandler(searchHistoryController.clear));
router.delete("/:id", onlyUser, asyncHandler(searchHistoryController.delete));

module.exports = router;
