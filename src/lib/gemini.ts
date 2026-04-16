import { GoogleGenAI } from "@google/genai";
import { MealAnalysisSchema, type MealAnalysis } from "@/types";

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function analyzeMealImage(
  imageBuffer: Buffer,
  mimeType: string
): Promise<MealAnalysis> {
  const base64Image = imageBuffer.toString("base64");

  const response = await genai.models.generateContent({
    model: "gemini-3.1-flash-lite-preview",
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              mimeType,
              data: base64Image,
            },
          },
          {
            text: "이 음식 사진을 분석해주세요. 각 음식의 이름, 예상 1인분 양, 칼로리를 알려주세요.",
          },
        ],
      },
    ],
    config: {
      systemInstruction:
        "당신은 음식 영양 분석 전문가입니다. 사진 속 음식을 분석하여 각 음식의 이름(한국어), 예상 분량, 칼로리를 정확하게 산출하세요. 총 칼로리도 계산하세요.",
      responseMimeType: "application/json",
      responseSchema: {
        type: "object" as const,
        properties: {
          foods: {
            type: "array" as const,
            items: {
              type: "object" as const,
              properties: {
                name: { type: "string" as const },
                portion: { type: "string" as const },
                calories: { type: "number" as const },
              },
              required: ["name", "portion", "calories"],
            },
          },
          total_calories: { type: "number" as const },
          meal_description: { type: "string" as const },
        },
        required: ["foods", "total_calories", "meal_description"],
      },
    },
  });

  const text = response.text ?? "";
  const parsed = JSON.parse(text);
  return MealAnalysisSchema.parse(parsed);
}
