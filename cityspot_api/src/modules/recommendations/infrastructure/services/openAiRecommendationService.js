const env = require("../../../../shared/config/env");
const AppError = require("../../../../shared/errors/AppError");
const AiRecommendationPort = require("../../domain/ports/aiRecommendationPort");
const { buildRecommendationPrompt } = require("../../domain/services/recommendationPromptBuilder");

class OpenAiRecommendationService extends AiRecommendationPort {
  async generateRecommendations(preferences, activities) {
    if (!env.openai.apiKey) {
      throw new AppError("OpenAI credentials are not configured", 503);
    }

    const prompt = buildRecommendationPrompt(preferences, activities);
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.openai.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: env.openai.model,
        messages: [
          { role: "system", content: prompt.system },
          { role: "user", content: prompt.user }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" }
      })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = data?.error?.message || "OpenAI recommendation request failed";
      throw new AppError(message, 502);
    }

    return this.parseRecommendations(data);
  }

  parseRecommendations(data) {
    const content = data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new AppError("OpenAI returned an empty recommendation response", 502);
    }

    try {
      const parsedContent = JSON.parse(content);

      if (!Array.isArray(parsedContent.recommendations)) {
        throw new Error("Invalid recommendations format");
      }

      return parsedContent.recommendations;
    } catch (_error) {
      throw new AppError("OpenAI returned invalid recommendation JSON", 502);
    }
  }
}

module.exports = OpenAiRecommendationService;
