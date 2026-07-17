const { Router } = require("express");
const userRoutes = require("../../modules/users/infrastructure/routes/userRoutes");
const categoryRoutes = require("../../modules/categories/infrastructure/routes/categoryRoutes");
const activityRoutes = require("../../modules/activities/infrastructure/routes/activityRoutes");

const router = Router();

router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/activities", activityRoutes);

module.exports = router;
