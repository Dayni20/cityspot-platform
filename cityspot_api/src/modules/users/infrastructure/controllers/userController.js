const CreateUserDto = require("../../application/dtos/createUser");
const LoginUserDto = require("../../application/dtos/loginUser");
const UpdateProfileDto = require("../../application/dtos/updateProfile");
const UpdatePasswordDto = require("../../application/dtos/updatePassword");
const UserSequelizeRepository = require("../persistence/sequelize/userSequelizeRepository");
const RegisterUserUseCase = require("../../application/use-cases/registerUser");
const LoginUserUseCase = require("../../application/use-cases/loginUser");
const GetProfileUseCase = require("../../application/use-cases/getProfile");
const UpdateProfileUseCase = require("../../application/use-cases/updateProfile");
const UpdatePasswordUseCase = require("../../application/use-cases/updatePassword");
const DeactivateUserUseCase = require("../../application/use-cases/deactivateUser");

const userRepository = new UserSequelizeRepository();
const registerUser = new RegisterUserUseCase(userRepository);
const loginUser = new LoginUserUseCase(userRepository);
const getProfile = new GetProfileUseCase(userRepository);
const updateProfile = new UpdateProfileUseCase(userRepository);
const updatePassword = new UpdatePasswordUseCase(userRepository);
const deactivateUser = new DeactivateUserUseCase(userRepository);

class UserController {
  async register(req, res) {
    const dto = new CreateUserDto(req.body);
    const user = await registerUser.execute(dto);

    res.status(201).json({
      message: "User registered successfully",
      user
    });
  }

  async login(req, res) {
    const dto = new LoginUserDto(req.body);
    const result = await loginUser.execute(dto);

    res.status(200).json({
      message: "Login successful",
      ...result
    });
  }

  async getProfile(req, res) {
    const user = await getProfile.execute(req.user.id);

    res.status(200).json({ user });
  }

  async updateProfile(req, res) {
    const dto = new UpdateProfileDto(req.body);
    const user = await updateProfile.execute(req.user.id, dto);

    res.status(200).json({
      message: "Profile updated successfully",
      user
    });
  }

  async updatePassword(req, res) {
    const dto = new UpdatePasswordDto(req.body);
    await updatePassword.execute(req.user.id, dto);

    res.status(200).json({
      message: "Password updated successfully"
    });
  }

  async deactivateProfile(req, res) {
    const user = await deactivateUser.execute(req.user);

    res.status(200).json({
      message: "User deactivated successfully",
      user
    });
  }
}

module.exports = new UserController();
