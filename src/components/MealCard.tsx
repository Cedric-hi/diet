"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { mealTypeLabels, type Meal } from "@/types";

export function MealCard({ meal }: { meal: Meal }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!meal.image_path) return;
    const supabase = createClient();
    const { data } = supabase.storage
      .from("meal-images")
      .getPublicUrl(meal.image_path);
    // For private buckets, use createSignedUrl instead
    async function getUrl() {
      const supabase = createClient();
      const { data } = await supabase.storage
        .from("meal-images")
        .createSignedUrl(meal.image_path!, 3600);
      if (data?.signedUrl) setImageUrl(data.signedUrl);
    }
    getUrl();
  }, [meal.image_path]);

  const analysis = meal.analysis;

  return (
    <div className="overflow-hidden rounded-[8px] bg-white">
      <div className="flex gap-4 p-4">
        {/* Image */}
        {imageUrl && (
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-[8px]">
            <img
              src={imageUrl}
              alt="식사 사진"
              className="h-full w-full object-cover"
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="rounded-[980px] bg-apple-blue/10 px-2.5 py-0.5 text-[12px] font-semibold text-apple-blue">
              {mealTypeLabels[meal.meal_type]}
            </span>
            {meal.total_calories != null && (
              <span className="text-[14px] font-semibold tracking-[-0.224px] text-foreground">
                {meal.total_calories} kcal
              </span>
            )}
          </div>

          {analysis && (
            <div className="mt-2 space-y-1">
              {analysis.foods.map((food, i) => (
                <div
                  key={i}
                  className="flex justify-between text-[14px] tracking-[-0.224px]"
                >
                  <span className="text-text-secondary truncate">
                    {food.name}
                  </span>
                  <span className="flex-shrink-0 text-text-tertiary ml-2">
                    {food.portion} &middot; {food.calories}kcal
                  </span>
                </div>
              ))}
            </div>
          )}

          {analysis?.meal_description && (
            <p className="mt-2 text-[12px] tracking-[-0.12px] text-text-tertiary">
              {analysis.meal_description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
