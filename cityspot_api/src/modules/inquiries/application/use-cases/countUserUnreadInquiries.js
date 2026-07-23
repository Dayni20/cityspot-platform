class CountUserUnreadInquiriesUseCase {
  constructor(inquiryRepository) {
    this.inquiryRepository = inquiryRepository;
  }

  async execute(userId) {
    return this.inquiryRepository.countUnreadByUserId(userId);
  }
}

module.exports = CountUserUnreadInquiriesUseCase;
