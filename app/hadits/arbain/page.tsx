"use client";

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import arbainData from '../Arbain-an-nawawi/arbain.json';

export default function ArbainListPage() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black pt-16 pb-20">
            {/* Header Sticky */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/hadits"
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors font-medium group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Kembali</span>
                    </Link>

                    <div className="text-center">
                        <h1 className="font-bold text-gray-900 dark:text-white text-lg">
                            Arba'in An-Nawawi
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Total {arbainData.length} Hadits
                        </p>
                    </div>

                    <div className="w-10 sm:w-20"></div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
                {/* List */}
                <div className="grid grid-cols-1 gap-3 md:gap-4">
                    {arbainData.map((hadith) => (
                        <Link
                            key={hadith.no}
                            href={`/hadits/arbain/${hadith.no}`}
                            className="group bg-white dark:bg-neutral-900 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-neutral-800 hover:border-emerald-500/30 hover:shadow-lg dark:hover:shadow-emerald-500/10 transition-all flex items-start gap-4"
                        >
                            <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm border border-emerald-100 dark:border-emerald-800 group-hover:scale-110 transition-transform mt-1">
                                {hadith.no}
                            </div>
                            <div className="flex-grow min-w-0">
                                <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                                    {hadith.title}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed">
                                    {hadith.id}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
