const bcrypt = require("bcrypt");
const AppError = require("../../../../shared/errors/AppError");
const {
  normalizeName,
  normalizeEmail,
  normalizePhone,
  validatePassword,
  validatePublicRegistrationRole
} = require("../../../../shared/validators/userValidator");
const { toUserResponse } = require("../mappers/userMapper");

class RegisterUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(dto) {
    const userData = this.validate(dto);
    const existingUser = await this.userRepository.findByEmail(userData.email);

    if (existingUser) {
      throw new AppError("Email is already registered", 409);
    }

    const passwordHash = await bcrypt.hash(userData.password, 10);
    const user = await this.userRepository.create({
      ...userData,
      password: passwordHash,
      status: "ACTIVO"
    });

    return toUserResponse(user);
  }

  validate(dto) {
    return {
      name: normalizeName(dto.name),
      email: normalizeEmail(dto.email),
      password: validatePassword(dto.password),
      role: validatePublicRegistrationRole(dto.role),
      phone: normalizePhone(dto.phone)
    };
  }
}

module.exports = RegisterUserUseCase;
