const AppError = require("../../../../shared/errors/AppError");
const { normalizeCategoryId } = require("../../../../shared/validators/categoryValidator");

class DeleteCategoryUseCase {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id) {
    const deleted = await this.categoryRepository.delete(normalizeCategoryId(id));

    if (!deleted) {
      throw new AppError("Category not found", 404);
    }
  }
}

module.exports = DeleteCategoryUseCase;
