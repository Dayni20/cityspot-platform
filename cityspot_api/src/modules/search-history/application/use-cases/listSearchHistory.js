const SearchHistoryMapper = require("../mappers/searchHistoryMapper");

class ListSearchHistoryUseCase {
  constructor(searchHistoryRepository) {
    this.searchHistoryRepository = searchHistoryRepository;
  }

  async execute(userId) {
    const history = await this.searchHistoryRepository.findByUserId(userId);
    return history.map(SearchHistoryMapper.toResponse);
  }
}

module.exports = ListSearchHistoryUseCase;
