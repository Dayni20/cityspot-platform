function errorHandler(error, req, res, next) {
  if (error.name === "SequelizeUniqueConstraintError") {
    res.status(409).json({
      message: "Resource already exists"
    });
    return;
  }

  if (error.name === "SequelizeForeignKeyConstraintError") {
    res.status(409).json({
      message: "The resource cannot be deleted because it is associated with other records"
    });
    return;
  }

  if (error.name === "MulterError") {
    res.status(400).json({
      message: error.message
    });
    return;
  }

  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    message: error.message || "Internal server error"
  });
}

module.exports = errorHandler;
