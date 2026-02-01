"use client";

import { Trophy, Gamepad2, Sparkles } from "lucide-react";
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

                <div className="flex flex-col gap-2 md:gap-4">
                    <Link href="/quran/game" className="w-full group relative overflow-hidden bg-white border-2 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white transition-all duration-300 py-3 md:py-4 rounded-xl flex items-center justify-center font-bold shadow-lg shadow-blue-500/20">
                        <Gamepad2 className="w-5 h-5" />
                        <span>Game Al-Qur'an</span>
                    </Link>
                    <Link href="/hadits/game" className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-500/50 backdrop-blur-sm text-white border border-white/20 rounded-xl font-bold hover:bg-indigo-500/70 active:scale-95 transition-all">
                        <Sparkles className="w-5 h-5" />
                        <span>Game Hadits</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
