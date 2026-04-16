"use client";

import Link from "next/link";
import { handleSignOut } from "@/lib/auth";

export function Navigation() {
  return (
    <nav className="sticky top-0 z-50 h-12 bg-black/80 backdrop-blur-[20px] backdrop-saturate-[180%]">
      <div className="mx-auto flex h-full max-w-[980px] items-center justify-between px-4">
        <Link
          href="/dashboard"
          className="text-[14px] font-semibold leading-[1.29] tracking-[-0.224px] text-white"
        >
          Diet Tracker
        </Link>
        <div className="flex items-center gap-4">
          <Link
            href="/meals/new"
            className="rounded-[980px] bg-apple-blue px-4 py-1.5 text-[12px] font-normal text-white transition-colors hover:brightness-110"
          >
            식사 기록
          </Link>
          <button
            onClick={handleSignOut}
            className="text-[12px] font-normal text-white/80 transition-colors hover:text-white"
          >
            로그아웃
          </button>
        </div>
      </div>
    </nav>
  );
}
