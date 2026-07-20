const { Router } = require("express");
const userRoutes = require("../../modules/users/infrastructure/routes/userRoutes");
const categoryRoutes = require("../../modules/categories/infrastructure/routes/categoryRoutes");
const activityRoutes = require("../../modules/activities/infrastructure/routes/activityRoutes");
const imageRoutes = require("../../modules/images/infrastructure/routes/imageRoutes");
const favoriteRoutes = require("../../modules/favorites/infrastructure/routes/favoriteRoutes");
const searchHistoryRoutes = require("../../modules/search-history/infrastructure/routes/searchHistoryRoutes");
const recommendationRoutes = require("../../modules/recommendations/infrastructure/routes/recommendationRoutes");

const router = Router();

router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);
router.use("/activities", activityRoutes);
router.use("/activities/:activityId/images", imageRoutes);
router.use("/favorites", favoriteRoutes);
router.use("/search-history", searchHistoryRoutes);
router.use("/recommendations", recommendationRoutes);

module.exports = router;
