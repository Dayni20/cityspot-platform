const {
  normalizeImageDescription,
  normalizeBoolean,
  validateImageFile
} = require("../../../../shared/validators/imageValidator");

class UploadImageDto {
  constructor(body, file) {
    validateImageFile(file);

    this.file = file;
    this.description = normalizeImageDescription(body.description);
    this.isMain = normalizeBoolean(body.isMain);
  }
}

module.exports = UploadImageDto;
