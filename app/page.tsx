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
      <div className="max-w-md md:max-w-2xl mx-auto min-h-screen flex flex-col pt-0">

        {/* 1. Header Section (Prayer Times & Status) */}
        {/* No padding top here to let it touch the top or be close */}
        <section className="animate-in fade-in slide-in-from-top-4 duration-700">
          <PrayerStatus />
        </section>

        {/* Content Wrapper with Negative Margin to overlap Header */}
        <div className="px-4 md:px-0 space-y-4 -mt-6 relative z-20">

          {/* 2. Widget: Lanjut Mengaji */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <ProgressWidget />
          </section>

          {/* 3. Grid Menu: Core Features */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="font-bold text-gray-900 dark:text-white text-sm tracking-tight">Fitur Utama</h3>
            </div>
            <FeatureGrid />
          </section>

          {/* 4. Game Hub */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
            <GameHub />
          </section>

          {/* 5. AI Spotlight */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
            <AIBanner />
          </section>

          {/* 6. Footer */}
          <DashboardFooter />
        </div>
      </div>
    </div>
  );
}
