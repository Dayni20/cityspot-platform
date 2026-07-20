const env = require("../../../../shared/config/env");
const AppError = require("../../../../shared/errors/AppError");
const AiRecommendationPort = require("../../domain/ports/aiRecommendationPort");
const { buildRecommendationPrompt } = require("../../domain/services/recommendationPromptBuilder");

class GeminiRecommendationService extends AiRecommendationPort {
  async generateRecommendations(preferences, activities) {
    if (!env.gemini.apiKey) {
      throw new AppError("Gemini credentials are not configured", 503);
    }

    const prompt = buildRecommendationPrompt(preferences, activities);
    const response = await fetch(this.buildUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text: `${prompt.system}\n\n${prompt.user}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.3,
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              recommendations: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    activityId: { type: "NUMBER" },
                    reason: { type: "STRING" }
                  },
                  required: ["activityId", "reason"]
                }
              }
            },
            required: ["recommendations"]
          }
        }
      })
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const message = data?.error?.message || "Gemini recommendation request failed";
      throw new AppError(message, 502);
    }

    return this.parseRecommendations(data);
  }

  buildUrl() {
    const model = encodeURIComponent(env.gemini.model);
    const apiKey = encodeURIComponent(env.gemini.apiKey);

    return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  }

  parseRecommendations(data) {
    const content = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      throw new AppError("Gemini returned an empty recommendation response", 502);
    }

    try {
      const parsedContent = JSON.parse(this.normalizeJsonContent(content));

      if (!Array.isArray(parsedContent.recommendations)) {
        throw new Error("Invalid recommendations format");
      }

      return parsedContent.recommendations;
    } catch (_error) {
      throw new AppError("Gemini returned invalid recommendation JSON", 502);
    }
  }

  normalizeJsonContent(content) {
    const normalizedContent = String(content).trim();

    if (normalizedContent.startsWith("```")) {
      return normalizedContent
        .replace(/^```(?:json)?/i, "")
        .replace(/```$/i, "")
        .trim();
    }

    const firstBrace = normalizedContent.indexOf("{");
    const lastBrace = normalizedContent.lastIndexOf("}");

    if (firstBrace >= 0 && lastBrace > firstBrace) {
      return normalizedContent.slice(firstBrace, lastBrace + 1);
    }

    return normalizedContent;
  }
}

module.exports = GeminiRecommendationService;
