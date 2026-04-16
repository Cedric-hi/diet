"use server";

import { createClient } from "@/lib/supabase/server";
import { optimizeImage } from "@/utils/image";
import { analyzeMealImage } from "@/lib/gemini";
import { CreateMealSchema, type MealAnalysis } from "@/types";
import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";

export async function uploadAndAnalyzeMeal(
  formData: FormData
): Promise<{ analysis?: MealAnalysis; error?: string }> {
  try {
    const file = formData.get("file") as File | null;
    const meal_date = formData.get("meal_date") as string;
    const meal_type = formData.get("meal_type") as string;
    const user_id = formData.get("user_id") as string;

    if (!file || !meal_date || !meal_type || !user_id) {
      return { error: "필수 항목을 모두 입력해주세요." };
    }

    // Validate input
    const parsed = CreateMealSchema.safeParse({ meal_date, meal_type });
    if (!parsed.success) {
      return { error: "입력값이 올바르지 않습니다." };
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Optimize image: webp conversion + max 800px width
    const { data: optimized, mimeType } = await optimizeImage(buffer);

    // Upload to Supabase Storage
    const supabase = await createClient();
    const fileName = `${user_id}/${randomUUID()}.webp`;

    const { error: uploadError } = await supabase.storage
      .from("meal-images")
      .upload(fileName, optimized, {
        contentType: mimeType,
        upsert: false,
      });

    if (uploadError) {
      return { error: `이미지 업로드 실패: ${uploadError.message}` };
    }

    // Analyze with Gemini
    const analysis = await analyzeMealImage(optimized, mimeType);

    // Save to database
    const { error: dbError } = await supabase.from("meals").insert({
      user_id,
      meal_date: parsed.data.meal_date,
      meal_type: parsed.data.meal_type,
      image_path: fileName,
      analysis,
      total_calories: analysis.total_calories,
    });

    if (dbError) {
      return { error: `기록 저장 실패: ${dbError.message}` };
    }

    revalidatePath("/dashboard");

    return { analysis };
  } catch (err) {
    console.error("uploadAndAnalyzeMeal error:", err);
    return { error: "처리 중 오류가 발생했습니다." };
  }
}
