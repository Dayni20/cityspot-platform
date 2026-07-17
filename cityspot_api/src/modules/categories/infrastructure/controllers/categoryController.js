const CreateCategoryDto = require("../../application/dtos/createCategory");
const UpdateCategoryDto = require("../../application/dtos/updateCategory");
const CategorySequelizeRepository = require("../persistence/sequelize/categorySequelizeRepository");
const CreateCategoryUseCase = require("../../application/use-cases/createCategory");
const ListCategoriesUseCase = require("../../application/use-cases/listCategories");
const GetCategoryUseCase = require("../../application/use-cases/getCategory");
const UpdateCategoryUseCase = require("../../application/use-cases/updateCategory");
const DeleteCategoryUseCase = require("../../application/use-cases/deleteCategory");

const categoryRepository = new CategorySequelizeRepository();
const createCategory = new CreateCategoryUseCase(categoryRepository);
const listCategories = new ListCategoriesUseCase(categoryRepository);
const getCategory = new GetCategoryUseCase(categoryRepository);
const updateCategory = new UpdateCategoryUseCase(categoryRepository);
const deleteCategory = new DeleteCategoryUseCase(categoryRepository);

class CategoryController {
  async create(req, res) {
    const dto = new CreateCategoryDto(req.body);
    const category = await createCategory.execute(dto);

    res.status(201).json({
      message: "Category created successfully",
      category
    });
  }

  async list(req, res) {
    const categories = await listCategories.execute();

    res.status(200).json({ categories });
  }

  async getById(req, res) {
    const category = await getCategory.execute(req.params.id);

    res.status(200).json({ category });
  }

  async update(req, res) {
    const dto = new UpdateCategoryDto(req.body);
    const category = await updateCategory.execute(req.params.id, dto);

    res.status(200).json({
      message: "Category updated successfully",
      category
    });
  }

  async delete(req, res) {
    await deleteCategory.execute(req.params.id);

    res.status(200).json({
      message: "Category deleted successfully"
    });
  }
}

module.exports = new CategoryController();
