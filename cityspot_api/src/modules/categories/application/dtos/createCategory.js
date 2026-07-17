const {
  normalizeCategoryName,
  normalizeCategoryDescription
} = require("../../../../shared/validators/categoryValidator");

class CreateCategoryDto {
  constructor({ name, description }) {
    this.name = normalizeCategoryName(name);
    this.description = normalizeCategoryDescription(description);
  }
}

module.exports = CreateCategoryDto;
