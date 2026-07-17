const { Router } = require("express");
const userRoutes = require("../../modules/users/infrastructure/routes/userRoutes");
const categoryRoutes = require("../../modules/categories/infrastructure/routes/categoryRoutes");

const router = Router();

router.use("/users", userRoutes);
router.use("/categories", categoryRoutes);

module.exports = router;
