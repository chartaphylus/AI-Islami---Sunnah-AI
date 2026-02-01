"use client";

import { BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ProgressWidget() {
    return (
        <div className="w-full bg-white dark:bg-neutral-900 rounded-2xl p-4 md:p-5 border border-gray-100 dark:border-white/5 shadow-sm flex items-center justify-between gap-4 group hover:border-emerald-500/30 transition-all">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <BookOpen className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        Lanjut Mengaji
                    </h3>
                </div>
            </div>

            <Link href="/quran" className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-emerald-500/20">
                <span>Buka</span>
                <ChevronRight className="w-3.5 h-3.5" />
            </Link>
        </div>
    );
}
