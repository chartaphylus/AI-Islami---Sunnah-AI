import Link from "next/link";
import { ChevronLeft, BookOpen, Heart } from "lucide-react";
import type { Doa } from "@/lib/types";

async function getDoaDetail(id: string): Promise<Doa> {
    const res = await fetch(`https://equran.id/api/doa/${id}`, {
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch doa detail");
    }

    const data = await res.json();
    return data.data;
}

export default async function DoaDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const doa = await getDoaDetail(id);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 pb-20">
            {/* Top Bar */}
            <div className="sticky top-0 z-30 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-800">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/doa"
                        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                        <span className="font-medium text-sm">Kembali</span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <Heart className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 pt-8">
                <div className="space-y-8">
                    {/* Header Info */}
                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-xs font-semibold uppercase tracking-wider">
                            <BookOpen className="w-3.5 h-3.5" />
                            {doa.grup}
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
                            {doa.nama}
                        </h1>
                    </div>

                    {/* Content Card */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 dark:border-neutral-800">
                        {/* Arabic Text */}
                        <div className="space-y-10">
                            <div className="flex flex-col items-center">
                                <p
                                    className="font-arabic text-4xl md:text-5xl text-gray-900 dark:text-white text-center leading-[2.5] select-all"
                                    dir="rtl"
                                >
                                    {doa.ar}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            {/* Copy button removed as requested */}

                            <div className="space-y-8 pt-8 border-t border-gray-50 dark:border-neutral-800">
                                {/* Transliteration */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                        Transliterasi
                                    </h4>
                                    <p className="text-lg text-emerald-700 dark:text-emerald-400 italic leading-relaxed">
                                        {doa.tr}
                                    </p>
                                </div>

                                {/* Indonesian Translation */}
                                <div className="space-y-3">
                                    <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                        Terjemahan
                                    </h4>
                                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                                        {doa.idn}
                                    </p>
                                </div>

                                {/* footnotes / info */}
                                {doa.tentang && (
                                    <div className="space-y-3 p-6 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl">
                                        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                                            Keterangan & Sumber
                                        </h4>
                                        <pre className="text-sm text-gray-500 dark:text-gray-400 whitespace-pre-wrap font-sans leading-relaxed">
                                            {doa.tentang}
                                        </pre>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap justify-center">
                        {doa.tag.map((tag) => (
                            <span
                                key={tag}
                                className="px-4 py-2 bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 text-gray-500 dark:text-gray-400 rounded-2xl text-sm"
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
