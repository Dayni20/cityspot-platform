class CategoryMapper {
  static toResponse(category) {
    return {
      id: category.id,
      name: category.name,
      description: category.description
    };
  }
}

module.exports = CategoryMapper;
