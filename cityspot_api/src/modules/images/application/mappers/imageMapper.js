class ImageMapper {
  static toResponse(image) {
    return {
      id: image.id,
      activityId: image.activityId,
      imageUrl: image.imageUrl,
      description: image.description,
      isMain: image.isMain
    };
  }
}

module.exports = ImageMapper;
