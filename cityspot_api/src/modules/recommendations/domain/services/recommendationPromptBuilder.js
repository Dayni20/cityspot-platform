function buildRecommendationPrompt(preferences, activities) {
  return {
    system:
      "You are a tourism recommendation assistant for CitySpot. Recommend only activities from the provided list.",
    user: JSON.stringify({
      instructions: [
        "Select up to 5 activities that best match the user preferences.",
        "If preferences.query exists, treat it as the main natural language request.",
        "Use only activityId values from the activities list.",
        "Write each reason in Spanish, briefly and clearly.",
        "Do not invent activities, prices, cities, categories, schedules, or contact data.",
        "Return only this JSON shape: {\"recommendations\":[{\"activityId\":1,\"reason\":\"texto\"}]}."
      ],
      responseFormat: {
        recommendations: [
          {
            activityId: "number",
            reason: "string"
          }
        ]
      },
      preferences,
      activities
    })
  };
}

module.exports = {
  buildRecommendationPrompt
};
