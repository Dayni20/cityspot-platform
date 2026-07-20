const SearchHistoryRepository = require("../../../domain/repositories/searchHistoryRepository");
const SearchHistory = require("../../../domain/entities/searchHistory");
const SearchHistoryModel = require("./searchHistoryModel");

class SearchHistoryMongooseRepository extends SearchHistoryRepository {
  async create(searchData) {
    const searchHistory = await SearchHistoryModel.create(searchData);
    return this.toEntity(searchHistory);
  }

  async findByUserId(userId) {
    const history = await SearchHistoryModel.find({ userId }).sort({ searchedAt: -1 }).limit(30);
    return history.map((item) => this.toEntity(item));
  }

  async deleteByIdAndUserId(id, userId) {
    const result = await SearchHistoryModel.deleteOne({ _id: id, userId });
    return result.deletedCount > 0;
  }

  async deleteByUserId(userId) {
    const result = await SearchHistoryModel.deleteMany({ userId });
    return result.deletedCount;
  }

  toEntity(searchHistoryModel) {
    if (!searchHistoryModel) {
      return null;
    }

    const searchHistory = searchHistoryModel.toObject({ virtuals: true });

    return new SearchHistory({
      id: searchHistory._id.toString(),
      userId: searchHistory.userId,
      city: searchHistory.city,
      company: searchHistory.company,
      budget: searchHistory.budget,
      activityType: searchHistory.activityType,
      searchedAt: searchHistory.searchedAt
    });
  }
}

module.exports = SearchHistoryMongooseRepository;
