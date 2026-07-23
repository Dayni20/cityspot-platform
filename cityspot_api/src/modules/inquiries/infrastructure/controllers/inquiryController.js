const ActivitySequelizeRepository = require("../../../activities/infrastructure/persistence/sequelize/activitySequelizeRepository");
const CreateInquiryUseCase = require("../../application/use-cases/createInquiry");
const ListUserInquiriesUseCase = require("../../application/use-cases/listUserInquiries");
const ListOwnerInquiriesUseCase = require("../../application/use-cases/listOwnerInquiries");
const CountOwnerPendingInquiriesUseCase = require("../../application/use-cases/countOwnerPendingInquiries");
const CountUserUnreadInquiriesUseCase = require("../../application/use-cases/countUserUnreadInquiries");
const MarkUserInquiriesReadUseCase = require("../../application/use-cases/markUserInquiriesRead");
const AnswerInquiryUseCase = require("../../application/use-cases/answerInquiry");
const InquirySequelizeRepository = require("../persistence/sequelize/inquirySequelizeRepository");

const inquiryRepository = new InquirySequelizeRepository();
const activityRepository = new ActivitySequelizeRepository();
const createInquiry = new CreateInquiryUseCase(inquiryRepository, activityRepository);
const listUserInquiries = new ListUserInquiriesUseCase(inquiryRepository);
const listOwnerInquiries = new ListOwnerInquiriesUseCase(inquiryRepository);
const countOwnerPendingInquiries = new CountOwnerPendingInquiriesUseCase(inquiryRepository);
const countUserUnreadInquiries = new CountUserUnreadInquiriesUseCase(inquiryRepository);
const markUserInquiriesRead = new MarkUserInquiriesReadUseCase(inquiryRepository);
const answerInquiry = new AnswerInquiryUseCase(inquiryRepository);

class InquiryController {
  async create(req, res) {
    const inquiry = await createInquiry.execute(req.user.id, req.params.activityId, req.body);

    res.status(201).json({
      message: "Inquiry sent successfully",
      inquiry
    });
  }

  async listMine(req, res) {
    const inquiries = await listUserInquiries.execute(req.user.id);

    res.status(200).json({ inquiries });
  }

  async userUnreadCount(req, res) {
    const unreadCount = await countUserUnreadInquiries.execute(req.user.id);

    res.status(200).json({ unreadCount });
  }

  async markMineAsRead(req, res) {
    const updatedCount = await markUserInquiriesRead.execute(req.user.id);

    res.status(200).json({
      message: "Inquiry responses marked as read",
      updatedCount
    });
  }

  async listOwner(req, res) {
    const inquiries = await listOwnerInquiries.execute(req.user.id);

    res.status(200).json({ inquiries });
  }

  async ownerPendingCount(req, res) {
    const pendingCount = await countOwnerPendingInquiries.execute(req.user.id);

    res.status(200).json({ pendingCount });
  }

  async answer(req, res) {
    const inquiry = await answerInquiry.execute(req.user.id, req.params.id, req.body);

    res.status(200).json({
      message: "Inquiry answered successfully",
      inquiry
    });
  }
}

module.exports = new InquiryController();
