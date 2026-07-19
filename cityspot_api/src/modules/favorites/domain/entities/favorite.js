class Favorite {
  constructor({ id, userId, activityId, savedAt, activity }) {
    this.id = id;
    this.userId = userId;
    this.activityId = activityId;
    this.savedAt = savedAt;
    this.activity = activity;
  }
}

module.exports = Favorite;
