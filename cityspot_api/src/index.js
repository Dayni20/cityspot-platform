const app = require("./server/bootstrap/app");
const env = require("./shared/config/env");
const sequelize = require("./shared/database/postgresql/sequelize");
const { connectMongoDB } = require("./shared/database/mongodb/mongoose");

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Conexion a PostgreSQL establecida correctamente");

    await connectMongoDB();
    console.log("Conexion a MongoDB establecida correctamente");

    app.listen(env.port, () => {
      console.log(`Servidor ejecutandose en http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("No se pudo iniciar CitySpot API:", error.message);
    process.exit(1);
  }
}

startServer();
