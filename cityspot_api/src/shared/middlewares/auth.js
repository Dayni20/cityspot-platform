const jwt = require("jsonwebtoken");
const env = require("../config/env");
const AppError = require("../errors/AppError");
const UserSequelizeRepository = require("../../modules/users/infrastructure/persistence/sequelize/userSequelizeRepository");

const userRepository = new UserSequelizeRepository();

async function authenticate(req, res, next) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      throw new AppError("Authentication token is required", 401);
    }

    const token = authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, env.jwtSecret);
    const user = await userRepository.findById(decodedToken.id);

    if (!user || !user.isActive()) {
      throw new AppError("User is not active", 403);
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch (error) {
    next(error instanceof AppError ? error : new AppError("Invalid or expired token", 401));
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      next(new AppError("You do not have permission to access this resource", 403));
      return;
    }

    next();
  };
}

module.exports = {
  authenticate,
  authorizeRoles
};
