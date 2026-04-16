import { z } from "zod";

// Meal types
export const MealType = z.enum(["breakfast", "lunch", "dinner", "snack"]);
export type MealType = z.infer<typeof MealType>;

export const mealTypeLabels: Record<MealType, string> = {
  breakfast: "아침",
  lunch: "점심",
  dinner: "저녁",
  snack: "간식",
};

// Gemini analysis result
export const FoodItemSchema = z.object({
  name: z.string(),
  portion: z.string(),
  calories: z.number(),
});

export const MealAnalysisSchema = z.object({
  foods: z.array(FoodItemSchema),
  total_calories: z.number(),
  meal_description: z.string(),
});

export type FoodItem = z.infer<typeof FoodItemSchema>;
export type MealAnalysis = z.infer<typeof MealAnalysisSchema>;

// Meal record from DB
export interface Meal {
  id: string;
  user_id: string;
  meal_date: string;
  meal_type: MealType;
  image_path: string | null;
  analysis: MealAnalysis | null;
  total_calories: number | null;
  created_at: string;
}

// User from DB
export interface User {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
}

// Form input for creating a meal
export const CreateMealSchema = z.object({
  meal_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  meal_type: MealType,
});

export type CreateMealInput = z.infer<typeof CreateMealSchema>;
