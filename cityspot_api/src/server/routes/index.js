const { Router } = require("express");
const userRoutes = require("../../modules/users/infrastructure/routes/userRoutes");

const router = Router();

router.use("/users", userRoutes);

module.exports = router;
