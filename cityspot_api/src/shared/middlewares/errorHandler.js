function errorHandler(error, req, res, next) {
  if (error.name === "SequelizeUniqueConstraintError") {
    res.status(409).json({
      message: "Resource already exists"
    });
    return;
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || "Internal server error"
  });
}

module.exports = errorHandler;
