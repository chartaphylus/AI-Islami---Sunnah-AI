"use client";

import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ProgressWidget() {
    return (
        <div className="w-full relative overflow-hidden bg-white dark:bg-neutral-900 rounded-[1.5rem] px-5 py-3 border border-gray-100 dark:border-white/5 group">
            {/* Background Gradient/Glow - Adaptive */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-base md:text-lg text-gray-900 dark:text-white font-serif tracking-wide italic whitespace-nowrap">
                            Lanjut Mengaji
                        </h3>
                    </div>
                </div>

                <Link href="/quran" className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-[0_0_20px_rgba(5,150,105,0.3)] hover:shadow-[0_0_25px_rgba(5,150,105,0.5)]">
                    <span>Buka</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                </Link>
            </div>
        </div>
    );
}
