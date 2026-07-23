class CountSearchHistoryUseCase {
  constructor(searchHistoryRepository) {
    this.searchHistoryRepository = searchHistoryRepository;
  }

  async execute(userId) {
    return this.searchHistoryRepository.countByUserId(userId);
  }
}

module.exports = CountSearchHistoryUseCase;
