const {
  normalizeQuery,
  normalizeCity,
  normalizeCompany,
  normalizeBudget,
  normalizeActivityType,
  validateAtLeastOneSearchField
} = require("../../../../shared/validators/searchHistoryValidator");

class CreateSearchHistoryDto {
  constructor({ query, city, company, budget, activityType }) {
    this.query = normalizeQuery(query);
    this.city = normalizeCity(city);
    this.company = normalizeCompany(company);
    this.budget = normalizeBudget(budget);
    this.activityType = normalizeActivityType(activityType);

    validateAtLeastOneSearchField({
      query: this.query,
      city: this.city,
      company: this.company,
      budget: this.budget,
      activityType: this.activityType
    });
  }
}

module.exports = CreateSearchHistoryDto;
