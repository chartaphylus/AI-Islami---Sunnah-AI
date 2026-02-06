"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { ChevronLeft, Volume2 } from 'lucide-react';
import { getMufrodatByCategory, Mufrodat } from '../../actions';

export default function MufrodatDetailPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = use(params);
    const decodedCategory = decodeURIComponent(category);

    const [words, setWords] = useState<Mufrodat[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWords = async () => {
            const data = await getMufrodatByCategory(decodedCategory);
            setWords(data);
            setLoading(false);
        };
        fetchWords();
    }, [decodedCategory]);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black pb-20">
            {/* Header Sticky */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/mufradat"
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors font-medium group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Kategori</span>
                    </Link>

                    <div className="text-center">
                        <h1 className="font-bold text-gray-900 dark:text-white capitalize">
                            {decodedCategory}
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            {words.length} Kosa Kata
                        </p>
                    </div>

                    <div className="w-20"></div>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-24 bg-white dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {words.map((word) => (
                            <div
                                key={word.id}
                                className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:border-blue-500/20 transition-all flex items-center justify-between group active:scale-[0.98] active:border-blue-400"
                            >
                                <div className="text-left">
                                    <p className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                        {word.translation}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="font-arabic text-3xl md:text-4xl text-blue-600 dark:text-blue-400 mb-2 leading-relaxed" dir="rtl">
                                        {word.arabic}
                                    </p>
                                    {/* Optional: Add transliteration if available in DB later */}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
