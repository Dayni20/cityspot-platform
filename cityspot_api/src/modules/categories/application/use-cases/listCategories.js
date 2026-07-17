const CategoryMapper = require("../mappers/categoryMapper");

class ListCategoriesUseCase {
  constructor(categoryRepository) {
    this.categoryRepository = categoryRepository;
  }

  async execute() {
    const categories = await this.categoryRepository.findAll();
    return categories.map(CategoryMapper.toResponse);
  }
}

module.exports = ListCategoriesUseCase;
