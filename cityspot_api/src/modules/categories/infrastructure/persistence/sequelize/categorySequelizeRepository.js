const CategoryRepository = require("../../../domain/repositories/categoryRepository");
const Category = require("../../../domain/entities/category");
const CategoryModel = require("./categoryModel");

class CategorySequelizeRepository extends CategoryRepository {
  async create(categoryData) {
    const category = await CategoryModel.create(categoryData);
    return this.toEntity(category);
  }

  async findAll() {
    const categories = await CategoryModel.findAll({
      order: [["name", "ASC"]]
    });

    return categories.map((category) => this.toEntity(category));
  }

  async findById(id) {
    const category = await CategoryModel.findByPk(id);
    return this.toEntity(category);
  }

  async findByName(name) {
    const category = await CategoryModel.findOne({ where: { name } });
    return this.toEntity(category);
  }

  async update(id, categoryData) {
    const category = await CategoryModel.findByPk(id);

    if (!category) {
      return null;
    }

    await category.update(categoryData);
    return this.toEntity(category);
  }

  async delete(id) {
    const deletedRows = await CategoryModel.destroy({ where: { id } });
    return deletedRows > 0;
  }

  toEntity(categoryModel) {
    if (!categoryModel) {
      return null;
    }

    return new Category(categoryModel.get({ plain: true }));
  }
}

module.exports = CategorySequelizeRepository;
