const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../../../../shared/errors/AppError");
const env = require("../../../../shared/config/env");
const { normalizeEmail } = require("../../../../shared/validators/userValidator");
const { toUserResponse } = require("../mappers/userMapper");

class LoginUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(dto) {
    const email = this.validate(dto);
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    if (!user.isActive()) {
      throw new AppError("User is not active", 403);
    }

    const isPasswordValid = await bcrypt.compare(String(dto.password), user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid credentials", 401);
    }

    return {
      token: this.createToken(user),
      user: toUserResponse(user)
    };
  }

  validate(dto) {
    if (!dto.password) {
      throw new AppError("Password is required", 400);
    }

    if (!env.jwtSecret) {
      throw new AppError("JWT_SECRET is not configured", 500);
    }

    return normalizeEmail(dto.email);
  }

  createToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      env.jwtSecret,
      { expiresIn: "2h" }
    );
  }
}

module.exports = LoginUserUseCase;
