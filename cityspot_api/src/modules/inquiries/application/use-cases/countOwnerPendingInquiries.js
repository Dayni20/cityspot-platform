class CountOwnerPendingInquiriesUseCase {
  constructor(inquiryRepository) {
    this.inquiryRepository = inquiryRepository;
  }

  async execute(ownerId) {
    return this.inquiryRepository.countPendingByOwnerId(ownerId);
  }
}

module.exports = CountOwnerPendingInquiriesUseCase;
