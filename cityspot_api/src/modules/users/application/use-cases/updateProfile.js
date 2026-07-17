const AppError = require("../../../../shared/errors/AppError");
const {
  normalizeName,
  normalizeEmail,
  normalizePhone
} = require("../../../../shared/validators/userValidator");
const { toUserResponse } = require("../mappers/userMapper");

class UpdateProfileUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(userId, dto) {
    const profileData = await this.buildProfileData(userId, dto);
    const updatedUser = await this.userRepository.updateProfile(userId, profileData);

    if (!updatedUser) {
      throw new AppError("User not found", 404);
    }

    return toUserResponse(updatedUser);
  }

  async buildProfileData(userId, dto) {
    const profileData = {};

    if (dto.name !== undefined) {
      profileData.name = normalizeName(dto.name);
    }

    if (dto.email !== undefined) {
      profileData.email = await this.validateUniqueEmail(userId, dto.email);
    }

    if (dto.phone !== undefined) {
      profileData.phone = normalizePhone(dto.phone);
    }

    if (Object.keys(profileData).length === 0) {
      throw new AppError("No data was provided to update", 400);
    }

    return profileData;
  }

  async validateUniqueEmail(userId, email) {
    const normalizedEmail = normalizeEmail(email);
    const userWithEmail = await this.userRepository.findByEmail(normalizedEmail);

    if (userWithEmail && userWithEmail.id !== userId) {
      throw new AppError("Email is already registered", 409);
    }

    return normalizedEmail;
  }
}

module.exports = UpdateProfileUseCase;
