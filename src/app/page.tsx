import { LoginButton } from "@/components/LoginButton";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center bg-surface-dark text-white px-6">
      <div className="text-center max-w-[980px]">
        <h1 className="text-[40px] md:text-[56px] font-semibold leading-[1.07] tracking-[-0.28px]">
          Diet Tracker
        </h1>
        <p className="mt-4 text-[17px] md:text-[21px] font-normal leading-[1.19] tracking-[0.231px] text-white/80">
          사진 한 장으로 식단을 기록하고, AI가 칼로리를 분석합니다.
        </p>
        <div className="mt-8">
          <LoginButton />
        </div>
      </div>
    </main>
  );
}
