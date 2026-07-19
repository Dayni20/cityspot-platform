const ActivityMapper = require("../../../activities/application/mappers/activityMapper");

class FavoriteMapper {
  static toResponse(favorite) {
    return {
      id: favorite.id,
      userId: favorite.userId,
      activityId: favorite.activityId,
      savedAt: favorite.savedAt,
      activity: favorite.activity ? ActivityMapper.toResponse(favorite.activity) : null
    };
  }
}

module.exports = FavoriteMapper;
