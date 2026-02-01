"use client";

import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { Compass, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default function PrayerStatus() {
    const { prayerStatus, countdown, hijriDate, gregorianDate, location, cityName, loading } = usePrayerTimes();

    const prayerNameMap: Record<string, string> = {
        Fajr: "Subuh",
        Dhuhr: "Dzuhur",
        Asr: "Ashar",
        Maghrib: "Maghrib",
        Isha: "Isya"
    };

    const nextPrayerName = prayerStatus.next ? (prayerNameMap[prayerStatus.next] || prayerStatus.next) : "...";

    return (
        <div className="relative w-full overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-2xl shadow-emerald-500/20 p-6 pt-20 md:p-8">
            {/* Background Image */}
            <div className="absolute inset-0 opacity-60 pointer-events-none">
                <img src="/header_bg.png" alt="Mosque Background" className="w-full h-full object-cover" />
            </div>

            {/* Background Decorations (Overlay) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

            {/* Top Bar: Location & Qibla */}
            <div className="relative z-20 flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                    <MapPin className="w-3.5 h-3.5 text-emerald-100" />
                    <span className="text-xs font-medium text-emerald-50 tracking-wide line-clamp-1 max-w-[150px]">
                        {loading ? "Mendeteksi..." : cityName}
                    </span>
                </div>

                <Link href="/qibla" className="group flex flex-col items-center justify-center bg-white/10 backdrop-blur-md w-10 h-10 rounded-full border border-white/10 hover:bg-white/20 transition-all active:scale-95">
                    <Compass className="w-5 h-5 text-white group-hover:rotate-45 transition-transform duration-500" />
                </Link>
            </div>

            {/* Main Content: Countdown */}
            <div className="relative z-20 flex flex-col items-center text-center space-y-2">
                <div className="space-y-1">
                    <p className="text-emerald-100 text-sm font-medium uppercase tracking-widest text-shadow-sm">
                        Menuju <span className="font-bold text-white">{nextPrayerName}</span>
                    </p>
                    {loading ? (
                        <div className="h-16 md:h-20 w-48 bg-white/10 animate-pulse rounded-xl mx-auto" />
                    ) : (
                        <h1 className="text-4xl md:text-5xl font-bold font-mono tracking-tighter text-white drop-shadow-md">
                            {countdown}
                        </h1>
                    )}
                </div>

                {/* Date Row */}
                <div className="flex items-center gap-2 text-emerald-50 text-[10px] md:text-sm font-medium bg-black/20 px-3 py-1.5 rounded-full backdrop-blur-md border border-white/5">
                    <Clock className="w-3 h-3" />
                    <span>{gregorianDate}</span>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span className="font-arabic">{hijriDate}</span>
                </div>
            </div>
        </div>
    );
}
