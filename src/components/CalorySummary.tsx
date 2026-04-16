export function CalorySummary({
  totalCalories,
  mealCount,
}: {
  totalCalories: number;
  mealCount: number;
}) {
  return (
    <div className="mt-6 rounded-[8px] bg-white p-6">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="text-[12px] font-semibold uppercase tracking-[-0.12px] text-text-tertiary">
            오늘 총 칼로리
          </p>
          <p className="mt-1 text-[40px] font-semibold leading-[1.10] text-foreground">
            {totalCalories.toLocaleString()}
            <span className="ml-1 text-[17px] font-normal text-text-secondary">
              kcal
            </span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[12px] font-semibold uppercase tracking-[-0.12px] text-text-tertiary">
            식사 횟수
          </p>
          <p className="mt-1 text-[28px] font-semibold leading-[1.14] text-foreground">
            {mealCount}
            <span className="ml-1 text-[14px] font-normal text-text-secondary">
              회
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
