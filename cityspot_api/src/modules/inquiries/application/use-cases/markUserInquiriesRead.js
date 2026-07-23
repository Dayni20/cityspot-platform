class MarkUserInquiriesReadUseCase {
  constructor(inquiryRepository) {
    this.inquiryRepository = inquiryRepository;
  }

  async execute(userId) {
    return this.inquiryRepository.markResponsesAsReadByUserId(userId);
  }
}

module.exports = MarkUserInquiriesReadUseCase;
