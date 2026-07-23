const AppError = require("../../../../shared/errors/AppError");
const { normalizeActivityId } = require("../../../../shared/validators/activityValidator");
const { normalizeInquiryText } = require("../../../../shared/validators/inquiryValidator");
const InquiryMapper = require("../mappers/inquiryMapper");

class CreateInquiryUseCase {
  constructor(inquiryRepository, activityRepository) {
    this.inquiryRepository = inquiryRepository;
    this.activityRepository = activityRepository;
  }

  async execute(userId, activityId, data) {
    const id = normalizeActivityId(activityId);
    const question = normalizeInquiryText(data.question, "Question");
    const activity = await this.activityRepository.findById(id);

    if (!activity || activity.status !== "ACTIVA") {
      throw new AppError("Activity not found", 404);
    }

    if (activity.ownerId === userId) {
      throw new AppError("Owner cannot ask about their own activity", 409);
    }

    const inquiry = await this.inquiryRepository.create({
      activityId: id,
      userId,
      ownerId: activity.ownerId,
      question,
      status: "PENDIENTE"
    });

    return InquiryMapper.toResponse(inquiry);
  }
}

module.exports = CreateInquiryUseCase;
