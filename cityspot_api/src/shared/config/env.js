const dotenv = require("dotenv");

dotenv.config({ quiet: true });

module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET,
  postgres: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 5432),
    database: process.env.DB_NAME || "cityspot_db",
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || ""
  },
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/cityspot_ia"
  }
};
