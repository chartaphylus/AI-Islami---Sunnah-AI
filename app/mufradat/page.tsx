"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, BookA, LayoutGrid, Sparkles } from 'lucide-react';
import { getMufrodatCategories } from './actions';

export default function MufrodatPage() {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCats = async () => {
            const data = await getMufrodatCategories();
            setCategories(data);
            setLoading(false);
        };
        fetchCats();
    }, []);

    const getCategoryColor = (index: number) => {
        const colors = [
            "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800",
            "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800",
            "text-orange-600 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800",
            "text-purple-600 bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800",
            "text-pink-600 bg-pink-50 dark:bg-pink-900/20 border-pink-100 dark:border-pink-800",
            "text-cyan-600 bg-cyan-50 dark:bg-cyan-900/20 border-cyan-100 dark:border-cyan-800"
        ];
        return colors[index % colors.length];
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black">
            {/* Header Sticky */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors font-medium group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Kembali</span>
                    </Link>

                    <div className="text-center">
                        <h1 className="font-bold text-gray-900 dark:text-white">
                            Kamus Mufrodat
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Kosa Kata Arab Sehari-hari
                        </p>
                    </div>

                    <Link href="/mufradat/game" className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                        <Sparkles className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 pt-8 pb-0">
                {loading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-32 bg-white dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {categories.map((cat, idx) => (
                            <Link
                                key={cat}
                                href={`/mufradat/detail/${encodeURIComponent(cat)}`}
                                className={`group p-6 rounded-2xl border transition-all hover:scale-[1.02] hover:shadow-lg flex flex-col items-center justify-center text-center gap-3 ${getCategoryColor(idx)}`}
                            >
                                <div className="w-12 h-12 rounded-full bg-white/60 dark:bg-black/20 flex items-center justify-center backdrop-blur-sm">
                                    <LayoutGrid className="w-6 h-6" />
                                </div>
                                <h3 className="font-bold text-lg leading-tight">
                                    {cat}
                                </h3>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
