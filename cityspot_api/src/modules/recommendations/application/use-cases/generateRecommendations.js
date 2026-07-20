const AppError = require("../../../../shared/errors/AppError");
const CreateRecommendationDto = require("../dtos/createRecommendation");
const RecommendationMapper = require("../mappers/recommendationMapper");

class GenerateRecommendationsUseCase {
  constructor(activityRecommendationRepository, aiRecommendationService, searchHistoryRepository) {
    this.activityRecommendationRepository = activityRecommendationRepository;
    this.aiRecommendationService = aiRecommendationService;
    this.searchHistoryRepository = searchHistoryRepository;
  }

  async execute(userId, recommendationData) {
    const preferences = new CreateRecommendationDto(recommendationData);
    const activities = await this.activityRecommendationRepository.findCandidateActivities(
      preferences
    );

    if (activities.length === 0) {
      throw new AppError("There are no active activities matching the search criteria", 404);
    }

    const aiRecommendations = await this.aiRecommendationService.generateRecommendations(
      preferences,
      activities
    );
    const recommendations = this.mergeAiRecommendations(aiRecommendations, activities);

    if (recommendations.length === 0) {
      throw new AppError("The AI service did not return valid activity recommendations", 502);
    }

    await this.searchHistoryRepository.create({
      ...preferences,
      userId
    });

    return recommendations.map(RecommendationMapper.toResponse);
  }

  mergeAiRecommendations(aiRecommendations, activities) {
    const activitiesById = new Map(activities.map((activity) => [activity.id, activity]));
    const usedIds = new Set();

    return aiRecommendations.reduce((recommendations, item) => {
      const activityId = Number(item.activityId);
      const activity = activitiesById.get(activityId);
      const reason = String(item.reason || "").trim();

      if (!activity || !reason || usedIds.has(activityId)) {
        return recommendations;
      }

      usedIds.add(activityId);
      recommendations.push({ activity, reason });
      return recommendations;
    }, []);
  }
}

module.exports = GenerateRecommendationsUseCase;
