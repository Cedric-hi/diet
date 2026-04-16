"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { MealCard } from "@/components/MealCard";
import { CalorySummary } from "@/components/CalorySummary";
import type { Meal } from "@/types";
import Link from "next/link";

export function DashboardContent({
  userId,
  initialDate,
}: {
  userId: string;
  initialDate: string;
}) {
  const [date, setDate] = useState(initialDate);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeals = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", userId)
      .eq("meal_date", date)
      .order("created_at", { ascending: true });

    setMeals((data as Meal[]) ?? []);
    setLoading(false);
  }, [userId, date]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  function shiftDate(days: number) {
    const d = new Date(date + "T00:00:00");
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().split("T")[0]!);
  }

  const formatted = new Date(date + "T00:00:00").toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });

  const totalCalories = meals.reduce(
    (sum, m) => sum + (m.total_calories ?? 0),
    0
  );

  return (
    <div className="mx-auto max-w-[980px] px-4 py-8">
      {/* Date Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => shiftDate(-1)}
          className="rounded-[980px] border border-link-blue px-4 py-2 text-[14px] text-link-blue transition-colors hover:bg-link-blue hover:text-white"
        >
          이전
        </button>
        <h1 className="text-[28px] font-normal leading-[1.14] tracking-[0.196px] text-foreground">
          {formatted}
        </h1>
        <button
          onClick={() => shiftDate(1)}
          className="rounded-[980px] border border-link-blue px-4 py-2 text-[14px] text-link-blue transition-colors hover:bg-link-blue hover:text-white"
        >
          다음
        </button>
      </div>

      {/* Calory Summary */}
      <CalorySummary totalCalories={totalCalories} mealCount={meals.length} />

      {/* Meals List */}
      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-center text-[14px] text-text-tertiary">
            불러오는 중...
          </p>
        ) : meals.length === 0 ? (
          <div className="rounded-[8px] bg-white p-8 text-center">
            <p className="text-[17px] text-text-secondary">
              기록된 식사가 없습니다.
            </p>
            <Link
              href="/meals/new"
              className="mt-4 inline-block rounded-[980px] bg-apple-blue px-6 py-2.5 text-[14px] text-white transition-colors hover:brightness-110"
            >
              식사 기록하기
            </Link>
          </div>
        ) : (
          meals.map((meal) => <MealCard key={meal.id} meal={meal} />)
        )}
      </div>
    </div>
  );
}
