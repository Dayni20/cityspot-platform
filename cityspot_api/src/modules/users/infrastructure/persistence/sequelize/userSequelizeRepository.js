const UserRepository = require("../../../domain/repositories/userRepository");
const User = require("../../../domain/entities/user");
const UserModel = require("./userModel");

class UserSequelizeRepository extends UserRepository {
  async create(userData) {
    const user = await UserModel.create(userData);
    return this.toEntity(user);
  }

  async findById(id) {
    const user = await UserModel.findByPk(id);
    return this.toEntity(user);
  }

  async findByEmail(email) {
    const user = await UserModel.findOne({ where: { email } });
    return this.toEntity(user);
  }

  async updateProfile(id, profileData) {
    const user = await UserModel.findByPk(id);

    if (!user) {
      return null;
    }

    await user.update(profileData);
    return this.toEntity(user);
  }

  async updateStatus(id, status) {
    const user = await UserModel.findByPk(id);

    if (!user) {
      return null;
    }

    await user.update({ status });
    return this.toEntity(user);
  }

  async updatePassword(id, password) {
    const user = await UserModel.findByPk(id);

    if (!user) {
      return null;
    }

    await user.update({ password });
    return this.toEntity(user);
  }

  toEntity(userModel) {
    if (!userModel) {
      return null;
    }

    return new User(userModel.get({ plain: true }));
  }
}

module.exports = UserSequelizeRepository;
