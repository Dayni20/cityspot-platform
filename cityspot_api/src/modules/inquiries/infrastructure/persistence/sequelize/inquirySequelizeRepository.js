const InquiryRepository = require("../../../domain/repositories/inquiryRepository");
const Inquiry = require("../../../domain/entities/inquiry");
const ActivityModel = require("../../../../activities/infrastructure/persistence/sequelize/activityModel");
const UserModel = require("../../../../users/infrastructure/persistence/sequelize/userModel");
const InquiryModel = require("./inquiryModel");

class InquirySequelizeRepository extends InquiryRepository {
  async create(inquiryData) {
    const inquiry = await InquiryModel.create(inquiryData);
    return this.toEntity(inquiry);
  }

  async findById(id) {
    const inquiry = await InquiryModel.findByPk(id);
    return this.toEntity(inquiry);
  }

  async findByUserId(userId) {
    const inquiries = await InquiryModel.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]]
    });

    return Promise.all(inquiries.map((inquiry) => this.toEntityWithDetails(inquiry)));
  }

  async findByOwnerId(ownerId) {
    const inquiries = await InquiryModel.findAll({
      where: { ownerId },
      order: [["createdAt", "DESC"]]
    });

    return Promise.all(inquiries.map((inquiry) => this.toEntityWithDetails(inquiry)));
  }

  async answer(id, answer) {
    const inquiry = await InquiryModel.findByPk(id);

    if (!inquiry) {
      return null;
    }

    await inquiry.update({
      answer,
      status: "RESPONDIDA",
      answeredAt: new Date(),
      responseRead: false
    });

    return this.toEntityWithDetails(inquiry);
  }

  async countPendingByOwnerId(ownerId) {
    return InquiryModel.count({
      where: {
        ownerId,
        status: "PENDIENTE"
      }
    });
  }

  async countUnreadByUserId(userId) {
    return InquiryModel.count({
      where: {
        userId,
        status: "RESPONDIDA",
        responseRead: false
      }
    });
  }

  async markResponsesAsReadByUserId(userId) {
    const [updatedCount] = await InquiryModel.update(
      { responseRead: true },
      {
        where: {
          userId,
          status: "RESPONDIDA",
          responseRead: false
        }
      }
    );

    return updatedCount;
  }

  async toEntityWithDetails(inquiryModel) {
    if (!inquiryModel) {
      return null;
    }

    const inquiry = inquiryModel.get({ plain: true });
    const [activity, user] = await Promise.all([
      ActivityModel.findByPk(inquiry.activityId),
      UserModel.findByPk(inquiry.userId)
    ]);

    return new Inquiry({
      ...inquiry,
      activityName: activity?.name || null,
      activityCity: activity?.city || null,
      userName: user?.name || null,
      userEmail: user?.email || null
    });
  }

  toEntity(inquiryModel) {
    if (!inquiryModel) {
      return null;
    }

    return new Inquiry(inquiryModel.get({ plain: true }));
  }
}

module.exports = InquirySequelizeRepository;
