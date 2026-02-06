"use client";

import { Trophy, Gamepad2, Sparkles, LayoutGrid } from "lucide-react";
import Link from "next/link";

export default function GameHub() {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 md:p-8 shadow-xl border border-blue-100 dark:border-blue-900/30 relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <Trophy className="w-5 h-5 text-yellow-500 animate-bounce" />
                    <h2 className="text-sm md:text-lg font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                        Tantangan Hari Ini
                    </h2>
                </div>

                <div className="mb-4">
                    <h3 className="text-xl md:text-3xl font-extrabold text-blue-600 dark:text-blue-400 leading-tight">
                        Uji hafalanmu dan raih skor tertinggi!
                    </h3>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-4">
                    {/* Game Al-Qur'an */}
                    <Link href="/quran/game" className="group relative overflow-hidden bg-white dark:bg-neutral-800 border-2 border-blue-100 dark:border-blue-900 hover:border-blue-500 dark:hover:border-blue-500 text-blue-600 dark:text-blue-400 transition-all duration-300 py-3 rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 active:border-blue-500">
                        <Gamepad2 className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-center">Al-Qur'an</span>
                    </Link>

                    {/* Game Hadits */}
                    <Link href="/hadits/game" className="group relative overflow-hidden bg-white dark:bg-neutral-800 border-2 border-amber-100 dark:border-amber-900 hover:border-amber-500 dark:hover:border-amber-500 text-amber-600 dark:text-amber-400 transition-all duration-300 py-3 rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 active:border-amber-500">
                        <Sparkles className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-center">Hadits</span>
                    </Link>

                    {/* Game Mufrodat */}
                    <Link href="/mufradat/game" className="group relative overflow-hidden bg-white dark:bg-neutral-800 border-2 border-emerald-100 dark:border-emerald-900 hover:border-emerald-500 dark:hover:border-emerald-500 text-emerald-600 dark:text-emerald-400 transition-all duration-300 py-3 rounded-xl flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 active:border-emerald-500">
                        <LayoutGrid className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="text-[10px] md:text-xs font-bold uppercase tracking-wider text-center">Mufrodat</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
