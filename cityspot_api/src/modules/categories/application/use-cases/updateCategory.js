const AppError = require("../../../../shared/errors/AppError");
const { normalizeCategoryId } = require("../../../../shared/validators/categoryValidator");
const CategoryMapper = require("../mappers/categoryMapper");

class UpdateCategoryUseCase {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(id, categoryData) {
    const categoryId = normalizeCategoryId(id);

    if (categoryData.name) {
      const existingCategory = await this.categoryRepository.findByName(categoryData.name);

      if (existingCategory && existingCategory.id !== categoryId) {
        throw new AppError("Category already exists", 409);
      }
    }

    const category = await this.categoryRepository.update(categoryId, categoryData);

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    return CategoryMapper.toResponse(category);
  }
}

module.exports = UpdateCategoryUseCase;
