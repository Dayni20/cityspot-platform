const {
  normalizeCity,
  normalizeCompany,
  normalizeBudget,
  normalizeActivityType,
  validateAtLeastOneSearchField
} = require("../../../../shared/validators/searchHistoryValidator");

class CreateRecommendationDto {
  constructor({ city, company, budget, activityType }) {
    this.city = normalizeCity(city);
    this.company = normalizeCompany(company);
    this.budget = normalizeBudget(budget);
    this.activityType = normalizeActivityType(activityType);

    validateAtLeastOneSearchField({
      city: this.city,
      company: this.company,
      budget: this.budget,
      activityType: this.activityType
    });
  }
}

module.exports = CreateRecommendationDto;
