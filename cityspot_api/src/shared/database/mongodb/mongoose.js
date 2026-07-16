const mongoose = require("mongoose");
const env = require("../../config/env");

async function connectMongoDB() {
  await mongoose.connect(env.mongodb.uri);
  return mongoose.connection;
}

module.exports = {
  mongoose,
  connectMongoDB
};
