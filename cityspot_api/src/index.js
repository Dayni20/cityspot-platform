const app = require("./server/bootstrap/app");
const env = require("./shared/config/env");
const sequelize = require("./shared/database/postgresql/sequelize");
const { connectMongoDB } = require("./shared/database/mongodb/mongoose");

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connection established successfully");

    await connectMongoDB();
    console.log("MongoDB connection established successfully");

    app.listen(env.port, () => {
      console.log(`Server running at http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("CitySpot API could not start:", error.message);
    process.exit(1);
  }
}

startServer();
