const GenerateRecommendationsUseCase = require("../../application/use-cases/generateRecommendations");
const ActivityRecommendationSequelizeRepository = require("../persistence/sequelize/activityRecommendationSequelizeRepository");
const OpenAiRecommendationService = require("../services/openAiRecommendationService");
const SearchHistoryMongooseRepository = require("../../../search-history/infrastructure/persistence/mongoose/searchHistoryMongooseRepository");

const activityRecommendationRepository = new ActivityRecommendationSequelizeRepository();
const aiRecommendationService = new OpenAiRecommendationService();
const searchHistoryRepository = new SearchHistoryMongooseRepository();

const generateRecommendationsUseCase = new GenerateRecommendationsUseCase(
  activityRecommendationRepository,
  aiRecommendationService,
  searchHistoryRepository
);

async function generate(req, res) {
  const recommendations = await generateRecommendationsUseCase.execute(req.user.id, req.body);

  res.status(200).json({
    recommendations
  });
}

module.exports = {
  generate
};
