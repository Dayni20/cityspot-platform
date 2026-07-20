const SearchHistoryMapper = require("../mappers/searchHistoryMapper");

class SaveSearchHistoryUseCase {
  constructor(searchHistoryRepository) {
    this.searchHistoryRepository = searchHistoryRepository;
  }

  async execute(userId, searchData) {
    const searchHistory = await this.searchHistoryRepository.create({
      ...searchData,
      userId
    });

    return SearchHistoryMapper.toResponse(searchHistory);
  }
}

module.exports = SaveSearchHistoryUseCase;
