const AppError = require("../../../../shared/errors/AppError");
const { normalizeMongoId } = require("../../../../shared/validators/searchHistoryValidator");

class DeleteSearchHistoryUseCase {
  constructor(searchHistoryRepository) {
    this.searchHistoryRepository = searchHistoryRepository;
  }

  async execute(id, userId) {
    const deleted = await this.searchHistoryRepository.deleteByIdAndUserId(
      normalizeMongoId(id),
      userId
    );

    if (!deleted) {
      throw new AppError("Search history not found", 404);
    }
  }
}

module.exports = DeleteSearchHistoryUseCase;
