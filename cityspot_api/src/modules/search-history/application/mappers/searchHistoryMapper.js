class SearchHistoryMapper {
  static toResponse(searchHistory) {
    return {
      id: searchHistory.id,
      userId: searchHistory.userId,
      city: searchHistory.city,
      company: searchHistory.company,
      budget: searchHistory.budget,
      activityType: searchHistory.activityType,
      searchedAt: searchHistory.searchedAt
    };
  }
}

module.exports = SearchHistoryMapper;
