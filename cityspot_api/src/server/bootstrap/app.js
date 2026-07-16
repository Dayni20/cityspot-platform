const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({
    mensaje: "API de CitySpot funcionando correctamente"
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    servicio: "cityspot_api"
  });
});

module.exports = app;
