class Image {
  constructor({ id, activityId, imageUrl, description, isMain }) {
    this.id = id;
    this.activityId = activityId;
    this.imageUrl = imageUrl;
    this.description = description;
    this.isMain = isMain;
  }
}

module.exports = Image;
