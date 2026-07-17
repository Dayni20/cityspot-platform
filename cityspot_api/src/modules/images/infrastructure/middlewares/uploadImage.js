const multer = require("multer");
const AppError = require("../../../../shared/errors/AppError");
const {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_SIZE_IN_BYTES
} = require("../../../../shared/validators/imageValidator");

const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_SIZE_IN_BYTES
  },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_IMAGE_MIME_TYPES.includes(file.mimetype)) {
      cb(new AppError("Image must be JPEG, PNG or WEBP", 400));
      return;
    }

    cb(null, true);
  }
});

module.exports = uploadImage;
