const AppError = require("../../../../shared/errors/AppError");
const CategoryMapper = require("../mappers/categoryMapper");

class CreateCategoryUseCase {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute(categoryData) {
    const existingCategory = await this.categoryRepository.findByName(categoryData.name);

    if (existingCategory) {
      throw new AppError("Category already exists", 409);
    }

    const category = await this.categoryRepository.create(categoryData);
    return CategoryMapper.toResponse(category);
  }
}

module.exports = CreateCategoryUseCase;
