const AppError = require("../../../../shared/errors/AppError");
const { toUserResponse } = require("../mappers/userMapper");

class DeactivateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(authenticatedUser) {
    if (authenticatedUser.role === "ADMINISTRADOR") {
      throw new AppError("Administrators cannot deactivate their own account", 403);
    }

    const user = await this.userRepository.updateStatus(authenticatedUser.id, "INACTIVO");

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return toUserResponse(user);
  }
}

module.exports = DeactivateUserUseCase;
