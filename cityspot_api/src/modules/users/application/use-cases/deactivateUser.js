const AppError = require("../../../../shared/errors/AppError");
const { toUserResponse } = require("../mappers/userMapper");

class DeactivateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const user = await this.userRepository.updateStatus(userId, "INACTIVO");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return toUserResponse(user);
  }
}

module.exports = DeactivateUserUseCase;
