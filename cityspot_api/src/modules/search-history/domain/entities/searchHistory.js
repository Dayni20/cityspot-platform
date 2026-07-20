class SearchHistory {
  constructor({ id, userId, query, city, company, budget, activityType, searchedAt }) {
    this.id = id;
    this.userId = userId;
    this.query = query;
    this.city = city;
    this.company = company;
    this.budget = budget;
    this.activityType = activityType;
    this.searchedAt = searchedAt;
  }
}

module.exports = SearchHistory;
