const bcrypt = require("bcrypt");
const AppError = require("../../../../shared/errors/AppError");
const { validatePassword } = require("../../../../shared/validators/userValidator");

class UpdatePasswordUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, dto) {
    if (!dto.currentPassword) {
      throw new AppError("Current password is required", 400);
    }

    const newPassword = validatePassword(dto.newPassword);

    if (newPassword !== dto.confirmPassword) {
      throw new AppError("Password confirmation does not match", 400);
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isCurrentPasswordValid = await bcrypt.compare(String(dto.currentPassword), user.password);

    if (!isCurrentPasswordValid) {
      throw new AppError("Current password is incorrect", 401);
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      throw new AppError("New password must be different from current password", 409);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.userRepository.updatePassword(userId, hashedPassword);
  }
}

module.exports = UpdatePasswordUseCase;
