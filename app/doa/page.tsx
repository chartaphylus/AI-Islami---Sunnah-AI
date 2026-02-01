import DoaList from "@/components/DoaList";
import type { Doa } from "@/lib/types";
import { BookOpen } from "lucide-react";

async function getDoaList(): Promise<Doa[]> {
    const res = await fetch("https://equran.id/api/doa", {
        next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!res.ok) {
        throw new Error("Failed to fetch doa list");
    }

    const data = await res.json();
    return data.data || [];
}

export default async function DoaPage() {
    const doaList = await getDoaList();

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-16">
            {/* Standardized Hero Section (Matches Hadits Style) */}
            <div className="relative overflow-hidden pt-6 pb-8 md:pt-12 md:pb-20 border-b border-gray-100 dark:border-neutral-800 bg-white dark:bg-transparent">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5 pointer-events-none"></div>

                <div className="relative max-w-7xl mx-auto px-4 text-center space-y-3 md:space-y-6">
                    {/* Top Pill Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                        <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Koleksi Doa & Dzikir</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                        Kumpulan Doa
                    </h1>

                    {/* Description */}
                    <p className="text-xs md:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed px-4">
                        Temukan doa-doa dan dzikir dari Al-Qur'an dan Hadits untuk berbagai kebutuhan sehari-hari.
                    </p>

                    {/* Stats */}
                    <div className="mt-2 text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-widest">
                        Total {doaList.length} doa tersedia
                    </div>
                </div>
            </div>

            {/* Content & Search */}
            <div className="max-w-7xl mx-auto px-4 pb-16 pt-6">
                <DoaList doaList={doaList} />
            </div>
        </div>
    );
}
