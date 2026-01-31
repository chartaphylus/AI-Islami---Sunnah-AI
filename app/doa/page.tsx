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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-neutral-950 dark:to-neutral-900 pt-16">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-900/20 dark:to-teal-900/20" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-200/30 dark:bg-emerald-800/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-200/30 dark:bg-teal-800/20 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 py-8 md:py-16 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-emerald-100 dark:border-white/10 backdrop-blur-sm text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-4 md:mb-6">
                        <BookOpen className="w-4 h-4" />
                        Koleksi Doa & Dzikir
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                        Kumpulan{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
                            Doa Harian
                        </span>
                    </h1>

                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Temukan doa-doa dan dzikir dari Al-Qur'an dan Hadits untuk berbagai
                        kebutuhan sehari-hari.
                    </p>

                    <div className="mt-6 text-sm text-gray-500 dark:text-gray-500">
                        Total {doaList.length} doa tersedia
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 pb-16">
                <DoaList doaList={doaList} />
            </div>
        </div>
    );
}
