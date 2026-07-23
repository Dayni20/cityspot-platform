const AppError = require("../../../../shared/errors/AppError");
const { normalizeInquiryId, normalizeInquiryText } = require("../../../../shared/validators/inquiryValidator");
const InquiryMapper = require("../mappers/inquiryMapper");

class AnswerInquiryUseCase {
  constructor(inquiryRepository) {
    this.inquiryRepository = inquiryRepository;
  }

  async execute(ownerId, inquiryId, data) {
    const id = normalizeInquiryId(inquiryId);
    const answer = normalizeInquiryText(data.answer, "Answer");
    const inquiry = await this.inquiryRepository.findById(id);

    if (!inquiry) {
      throw new AppError("Inquiry not found", 404);
    }

    if (inquiry.ownerId !== ownerId) {
      throw new AppError("You can only answer inquiries for your activities", 403);
    }

    const answeredInquiry = await this.inquiryRepository.answer(id, answer);
    return InquiryMapper.toResponse(answeredInquiry);
  }
}

module.exports = AnswerInquiryUseCase;
