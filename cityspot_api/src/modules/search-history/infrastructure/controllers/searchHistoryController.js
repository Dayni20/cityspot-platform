const CreateSearchHistoryDto = require("../../application/dtos/createSearchHistory");
const SearchHistoryMongooseRepository = require("../persistence/mongoose/searchHistoryMongooseRepository");
const SaveSearchHistoryUseCase = require("../../application/use-cases/saveSearchHistory");
const ListSearchHistoryUseCase = require("../../application/use-cases/listSearchHistory");
const DeleteSearchHistoryUseCase = require("../../application/use-cases/deleteSearchHistory");
const ClearSearchHistoryUseCase = require("../../application/use-cases/clearSearchHistory");
const CountSearchHistoryUseCase = require("../../application/use-cases/countSearchHistory");

const searchHistoryRepository = new SearchHistoryMongooseRepository();
const saveSearchHistory = new SaveSearchHistoryUseCase(searchHistoryRepository);
const listSearchHistory = new ListSearchHistoryUseCase(searchHistoryRepository);
const deleteSearchHistory = new DeleteSearchHistoryUseCase(searchHistoryRepository);
const clearSearchHistory = new ClearSearchHistoryUseCase(searchHistoryRepository);
const countSearchHistory = new CountSearchHistoryUseCase(searchHistoryRepository);

class SearchHistoryController {
  async save(req, res) {
    const dto = new CreateSearchHistoryDto(req.body);
    const searchHistory = await saveSearchHistory.execute(req.user.id, dto);

    res.status(201).json({
      message: "Search history saved successfully",
      searchHistory
    });
  }

  async list(req, res) {
    const history = await listSearchHistory.execute(req.user.id);

    res.status(200).json({ history });
  }

  async count(req, res) {
    const historyCount = await countSearchHistory.execute(req.user.id);

    res.status(200).json({ historyCount });
  }

  async delete(req, res) {
    await deleteSearchHistory.execute(req.params.id, req.user.id);

    res.status(200).json({
      message: "Search history deleted successfully"
    });
  }

  async clear(req, res) {
    const deletedCount = await clearSearchHistory.execute(req.user.id);

    res.status(200).json({
      message: "Search history cleared successfully",
      deletedCount
    });
  }
}

module.exports = new SearchHistoryController();
