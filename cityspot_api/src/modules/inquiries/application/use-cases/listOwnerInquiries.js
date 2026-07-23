const InquiryMapper = require("../mappers/inquiryMapper");

class ListOwnerInquiriesUseCase {
  constructor(inquiryRepository) {
    this.inquiryRepository = inquiryRepository;
  }

  async execute(ownerId) {
    const inquiries = await this.inquiryRepository.findByOwnerId(ownerId);
    return inquiries.map(InquiryMapper.toResponse);
  }
}

module.exports = ListOwnerInquiriesUseCase;
