const AppError = require("../../../../shared/errors/AppError");
const { normalizeCategoryId } = require("../../../../shared/validators/categoryValidator");
const CategoryMapper = require("../mappers/categoryMapper");

class GetCategoryUseCase {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id) {
    const category = await this.categoryRepository.findById(normalizeCategoryId(id));

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return CategoryMapper.toResponse(category);
  }
}

module.exports = GetCategoryUseCase;
