"use client";

import PrayerStatus from "@/components/PrayerStatus";
import ProgressWidget from "@/components/ProgressWidget";
import FeatureGrid from "@/components/FeatureGrid";
import GameHub from "@/components/GameHub";
import AIBanner from "@/components/AIBanner";
import DashboardFooter from "@/components/DashboardFooter";
import FloatingAction from "@/components/FloatingAction";

export default function Home() {
  return (
    <div className="relative min-h-screen bg-gray-50 dark:bg-black pb-20 md:pb-10 font-sans selection:bg-emerald-100 selection:text-emerald-900">
      <FloatingAction />

      {/* Decorative Background for Whole Page */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20 dark:to-transparent -z-10 pointer-events-none" />

      {/* Main Content Container */}
      <div className="max-w-md md:max-w-7xl mx-auto min-h-screen flex flex-col pt-0 md:pt-24 transition-all duration-300">

        {/* 1. Header Section (Prayer Times & Status) */}
        {/* Align width with content grid on desktop */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-700 w-full px-0 md:px-8">
          <PrayerStatus />
        </section>

        {/* Content Wrapper */}
        {/* Remove negative margin on desktop; keep it for mobile if desired, but here we normalize for clarity */}
        <div className="px-4 md:px-8 mt-4 md:mt-8 relative z-20 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8">

          {/* 2. Widget: Lanjut Mengaji */}
          <section className="px-4 md:px-0 -mt-10 md:mt-0 relative z-30 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 md:col-span-4 self-start">
            <ProgressWidget />
          </section>

          {/* 3. Grid Menu: Core Features */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200 md:col-span-8">
            <div className="flex items-center justify-between mb-4 md:mb-5 px-1">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm md:text-base tracking-tight italic border-l-4 border-emerald-500 pl-3">Fitur Utama</h3>
            </div>
            <FeatureGrid />
          </section>

          {/* 5. AI Spotlight */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400 md:col-span-4 self-start">
            <AIBanner />
          </section>

          {/* 4. Game Hub */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300 md:col-span-8">
            <GameHub />
          </section>

          {/* 6. Footer */}
          <div className="md:col-span-12 mt-8 md:mt-16">
            <DashboardFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
