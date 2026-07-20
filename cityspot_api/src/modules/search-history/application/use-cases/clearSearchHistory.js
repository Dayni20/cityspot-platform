class ClearSearchHistoryUseCase {
  constructor(searchHistoryRepository) {
    this.searchHistoryRepository = searchHistoryRepository;
  }

  async execute(userId) {
    return this.searchHistoryRepository.deleteByUserId(userId);
  }
}

module.exports = ClearSearchHistoryUseCase;
