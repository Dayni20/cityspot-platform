const AppError = require("../../../../shared/errors/AppError");
const { toUserResponse } = require("../mappers/userMapper");

class GetProfileUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return toUserResponse(user);
  }
}

module.exports = GetProfileUseCase;
