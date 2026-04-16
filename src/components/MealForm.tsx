"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { MealType, mealTypeLabels, type MealAnalysis } from "@/types";
import { uploadAndAnalyzeMeal } from "@/app/meals/new/actions";

export function MealForm({
  userId,
  defaultDate,
}: {
  userId: string;
  defaultDate: string;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [date, setDate] = useState(defaultDate);
  const [mealType, setMealType] = useState<MealType | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setAnalysis(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(selected);
  }

  async function handleSubmit() {
    if (!mealType || !file) return;
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("meal_date", date);
      formData.append("meal_type", mealType);
      formData.append("user_id", userId);

      const result = await uploadAndAnalyzeMeal(formData);

      if (result.error) {
        setError(result.error);
      } else if (result.analysis) {
        setAnalysis(result.analysis);
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("식사 기록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }

  const isReady = mealType && file && date;

  return (
    <div className="space-y-6">
      {/* Date Picker */}
      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-[-0.12px] text-text-tertiary">
          날짜
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-2 w-full rounded-[8px] bg-white px-4 py-3 text-[17px] text-foreground outline-none focus:ring-2 focus:ring-apple-blue"
        />
      </div>

      {/* Meal Type */}
      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-[-0.12px] text-text-tertiary">
          식사 시간
        </label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {MealType.options.map((type) => (
            <button
              key={type}
              onClick={() => setMealType(type)}
              className={`rounded-[8px] py-3 text-[14px] font-semibold tracking-[-0.224px] transition-colors ${
                mealType === type
                  ? "bg-apple-blue text-white"
                  : "bg-white text-text-secondary hover:bg-apple-blue/10"
              }`}
            >
              {mealTypeLabels[type]}
            </button>
          ))}
        </div>
      </div>

      {/* Photo Upload */}
      <div>
        <label className="block text-[12px] font-semibold uppercase tracking-[-0.12px] text-text-tertiary">
          식사 사진
        </label>
        <div className="mt-2">
          {preview ? (
            <div className="relative">
              <img
                src={preview}
                alt="미리보기"
                className="w-full rounded-[8px] object-cover"
                style={{ maxHeight: 400 }}
              />
              <button
                onClick={() => {
                  setPreview(null);
                  setFile(null);
                  setAnalysis(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center justify-center rounded-[8px] border-2 border-dashed border-text-tertiary/30 bg-white py-12 transition-colors hover:border-apple-blue/50"
            >
              <svg className="h-10 w-10 text-text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
              </svg>
              <p className="mt-2 text-[14px] text-text-tertiary">
                사진을 선택하거나 촬영하세요
              </p>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-[8px] bg-red-50 p-4 text-[14px] text-red-600">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!isReady || loading}
        className={`w-full rounded-[8px] py-3.5 text-[17px] font-normal text-white transition-colors ${
          isReady && !loading
            ? "bg-apple-blue hover:brightness-110"
            : "bg-text-tertiary cursor-not-allowed"
        }`}
      >
        {loading ? "분석 중..." : "기록하기"}
      </button>
    </div>
  );
}
