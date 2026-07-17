const { Op } = require("sequelize");
const ActivityRepository = require("../../../domain/repositories/activityRepository");
const Activity = require("../../../domain/entities/activity");
const ActivityModel = require("./activityModel");

class ActivitySequelizeRepository extends ActivityRepository {
  async create(activityData) {
    const activity = await ActivityModel.create(activityData);
    return this.toEntity(activity);
  }

  async findAll(filters = {}) {
    const where = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.city) {
      where.city = { [Op.iLike]: `%${filters.city}%` };
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    const activities = await ActivityModel.findAll({
      where,
      order: [["createdAt", "DESC"]]
    });

    return activities.map((activity) => this.toEntity(activity));
  }

  async findById(id) {
    const activity = await ActivityModel.findByPk(id);
    return this.toEntity(activity);
  }

  async findByOwnerId(ownerId) {
    const activities = await ActivityModel.findAll({
      where: { ownerId },
      order: [["createdAt", "DESC"]]
    });

    return activities.map((activity) => this.toEntity(activity));
  }

  async update(id, activityData) {
    const activity = await ActivityModel.findByPk(id);

    if (!activity) {
      return null;
    }

    await activity.update(activityData);
    return this.toEntity(activity);
  }

  async updateStatus(id, status) {
    const activity = await ActivityModel.findByPk(id);

    if (!activity) {
      return null;
    }

    await activity.update({ status });
    return this.toEntity(activity);
  }

  toEntity(activityModel) {
    if (!activityModel) {
      return null;
    }

    return new Activity(activityModel.get({ plain: true }));
  }
}

module.exports = ActivitySequelizeRepository;
