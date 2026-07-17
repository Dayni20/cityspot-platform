const express = require("express");
const cors = require("cors");
const apiRoutes = require("../routes");
const errorHandler = require("../../shared/middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    message: "CitySpot API is running correctly"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    service: "cityspot_api"
  });
});

app.use("/api", apiRoutes);
app.use(errorHandler);

module.exports = app;
