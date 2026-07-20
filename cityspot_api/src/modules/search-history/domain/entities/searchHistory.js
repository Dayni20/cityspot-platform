class SearchHistory {
  constructor({ id, userId, city, company, budget, activityType, searchedAt }) {
    this.id = id;
    this.userId = userId;
    this.city = city;
    this.company = company;
    this.budget = budget;
    this.activityType = activityType;
    this.searchedAt = searchedAt;
  }
}

module.exports = SearchHistory;
