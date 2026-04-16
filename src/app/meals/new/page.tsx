import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MealForm } from "@/components/MealForm";

export default async function NewMealPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/");

  const today = new Date().toISOString().split("T")[0]!;

  return (
    <div className="mx-auto max-w-[980px] px-4 py-8">
      <h1 className="text-[28px] font-normal leading-[1.14] tracking-[0.196px] text-foreground">
        식사 기록
      </h1>
      <div className="mt-6">
        <MealForm userId={user.id} defaultDate={today} />
      </div>
    </div>
  );
}
