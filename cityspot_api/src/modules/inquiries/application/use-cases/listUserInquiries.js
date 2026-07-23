const InquiryMapper = require("../mappers/inquiryMapper");

class ListUserInquiriesUseCase {
  constructor(inquiryRepository) {
    this.inquiryRepository = inquiryRepository;
  }

  async execute(userId) {
    const inquiries = await this.inquiryRepository.findByUserId(userId);
    return inquiries.map(InquiryMapper.toResponse);
  }
}

module.exports = ListUserInquiriesUseCase;
