const {
  normalizeCategoryName,
  normalizeCategoryDescription
} = require("../../../../shared/validators/categoryValidator");
const AppError = require("../../../../shared/errors/AppError");

class UpdateCategoryDto {
  constructor({ name, description }) {
    if (name === undefined && description === undefined) {
      throw new AppError("At least one category field is required", 400);
    }

    if (name !== undefined) {
      this.name = normalizeCategoryName(name);
    }

    if (description !== undefined) {
      this.description = normalizeCategoryDescription(description);
    }
  }
}

module.exports = UpdateCategoryDto;
