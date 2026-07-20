const { Op } = require("sequelize");
const ActivityRecommendationRepository = require("../../../domain/repositories/activityRecommendationRepository");
const ActivityModel = require("../../../../activities/infrastructure/persistence/sequelize/activityModel");
const CategoryModel = require("../../../../categories/infrastructure/persistence/sequelize/categoryModel");

class ActivityRecommendationSequelizeRepository extends ActivityRecommendationRepository {
  async findCandidateActivities(preferences) {
    const where = {
      status: "ACTIVA"
    };

    if (preferences.city) {
      where.city = { [Op.iLike]: `%${preferences.city}%` };
    }

    if (preferences.budget !== null && preferences.budget !== undefined) {
      where[Op.or] = [
        { referencePrice: { [Op.lte]: preferences.budget } },
        { referencePrice: { [Op.is]: null } }
      ];
    }

    const activities = await ActivityModel.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: 30
    });

    const categoryIds = [...new Set(activities.map((activity) => activity.categoryId))];
    if (categoryIds.length === 0) {
      return [];
    }

    const categories = await CategoryModel.findAll({
      where: {
        id: categoryIds
      }
    });
    const categoriesById = new Map(categories.map((category) => [category.id, category.name]));

    return activities.map((activityModel) => {
      const activity = activityModel.get({ plain: true });

      return {
        id: activity.id,
        name: activity.name,
        description: activity.description,
        city: activity.city,
        address: activity.address,
        category: categoriesById.get(activity.categoryId) || null,
        referencePrice:
          activity.referencePrice === null || activity.referencePrice === undefined
            ? null
            : Number(activity.referencePrice),
        schedule: activity.schedule,
        contactPhone: activity.contactPhone,
        contactEmail: activity.contactEmail
      };
    });
  }
}

module.exports = ActivityRecommendationSequelizeRepository;
