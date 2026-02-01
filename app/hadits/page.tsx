"use client";

import Link from 'next/link';
import { BookOpen, Library, ChevronRight, Play, Sparkles, Calculator } from 'lucide-react';

export default function HadithLandingPage() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black pt-16">
            {/* Hero Section */}
            <div className="relative overflow-hidden pt-6 pb-8 md:pt-12 md:pb-20">
                <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>
                <div className="relative max-w-5xl mx-auto px-4 text-center space-y-3 md:space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                        <Library className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Ensiklopedia Hadits</span>
                    </div>
                    <h1 className="text-2xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                        Kumpulan Hadits
                    </h1>
                    <p className="text-xs md:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed px-4">
                        Jelajahi ribuan hadits dari berbagai perawi terpercaya.
                    </p>
                </div>
            </div>

            {/* Collections Grid */}
            <div className="max-w-4xl mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5">

                    {/* Game Hadits Card */}
                    <Link
                        href="/hadits/game"
                        className="group relative bg-white dark:bg-neutral-900 rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 border border-gray-200 dark:border-neutral-800 shadow-sm md:shadow-xl shadow-emerald-500/5 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 md:w-40 md:h-40 bg-gradient-to-br from-emerald-500 to-teal-600 opacity-10 rounded-bl-[100%] group-hover:scale-110 transition-transform duration-500"></div>

                        <div className="relative z-10 flex flex-row md:flex-col h-full items-center md:items-start gap-4 md:gap-0 md:justify-between">
                            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-100 dark:border-emerald-800">
                                <Play className="w-5 h-5 md:w-6 md:h-6 fill-current translate-x-0.5" />
                            </div>
                            <div className="flex-grow space-y-1 md:space-y-4 md:mt-4">
                                <h3 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    Game Hadits
                                </h3>
                                <p className="text-xs md:text-base text-gray-500 dark:text-gray-400 leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-none">
                                    Uji Hafalan Arba'in.
                                </p>
                            </div>
                            <div className="hidden md:flex mt-8 items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400 group-hover:gap-3 transition-all">
                                <span>Main Sekarang</span>
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </Link>

                    {/* Kutubut Tis'ah Card */}
                    <Link
                        href="/hadits/kutubut-tisah"
                        className="group relative bg-white dark:bg-neutral-900 rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 border border-gray-200 dark:border-neutral-800 shadow-sm md:shadow-xl shadow-blue-500/5 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-10 rounded-bl-[100%] group-hover:scale-110 transition-transform duration-500"></div>

                        <div className="relative z-10 flex flex-row md:flex-col h-full items-center md:items-start gap-4 md:gap-0 md:justify-between">

                            {/* Icon */}
                            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800">
                                <BookOpen className="w-6 h-6 md:w-7 md:h-7" />
                            </div>

                            {/* Content */}
                            <div className="flex-grow space-y-1 md:space-y-4 md:mt-4">
                                <h3 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    Kutubut Tis'ah
                                </h3>
                                <p className="text-xs md:text-base text-gray-500 dark:text-gray-400 leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-none">
                                    9 Kitab Induk (Bukhari, Muslim, dll).
                                </p>
                            </div>

                            {/* Arrow */}
                            <div className="md:hidden">
                                <ChevronRight className="w-5 h-5 text-gray-300" />
                            </div>
                            <div className="hidden md:flex mt-8 items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
                                <span>Mulai Membaca</span>
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </Link>

                    {/* Arbain An-Nawawi Card */}
                    <Link
                        href="/hadits/arbain"
                        className="group relative bg-white dark:bg-neutral-900 rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 border border-gray-200 dark:border-neutral-800 shadow-sm md:shadow-xl shadow-blue-500/5 hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 md:w-40 md:h-40 bg-gradient-to-br from-blue-500 to-indigo-600 opacity-10 rounded-bl-[100%] group-hover:scale-110 transition-transform duration-500"></div>

                        <div className="relative z-10 flex flex-row md:flex-col h-full items-center md:items-start gap-4 md:gap-0 md:justify-between">

                            {/* Icon */}
                            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800">
                                <Library className="w-6 h-6 md:w-7 md:h-7" />
                            </div>

                            {/* Content */}
                            <div className="flex-grow space-y-1 md:space-y-4 md:mt-4">
                                <h3 className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                    Arba'in An-Nawawi
                                </h3>
                                <p className="text-xs md:text-base text-gray-500 dark:text-gray-400 leading-snug md:leading-relaxed line-clamp-2 md:line-clamp-none">
                                    42 Hadits Pokok Ajaran Islam.
                                </p>
                            </div>

                            {/* Arrow */}
                            <div className="md:hidden">
                                <ChevronRight className="w-5 h-5 text-gray-300" />
                            </div>
                            <div className="hidden md:flex mt-8 items-center gap-2 text-sm font-bold text-blue-600 dark:text-blue-400 group-hover:gap-3 transition-all">
                                <span>Mulai Membaca</span>
                                <ChevronRight className="w-4 h-4" />
                            </div>
                        </div>
                    </Link>

                    {/* New Upcoming Collection Card */}
                    <div
                        className="group relative bg-white dark:bg-neutral-900 rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 border border-dashed border-gray-300 dark:border-neutral-800 opacity-60 transition-all duration-300 overflow-hidden cursor-not-allowed"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 md:w-40 md:h-40 bg-gray-100 dark:bg-neutral-800 opacity-20 rounded-bl-[100%]"></div>

                        <div className="relative z-10 flex flex-row md:flex-col h-full items-center md:items-start gap-4 md:gap-0 md:justify-between">

                            {/* Icon */}
                            <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gray-100 dark:bg-neutral-800 text-gray-400 flex items-center justify-center border border-gray-200 dark:border-neutral-700">
                                <Sparkles className="w-6 h-6 md:w-7 md:h-7" />
                            </div>

                            {/* Content */}
                            <div className="flex-grow space-y-1 md:space-y-4 md:mt-4">
                                <h3 className="text-lg md:text-2xl font-bold text-gray-400 dark:text-neutral-500">
                                    Segera Hadir
                                </h3>
                                <p className="text-xs md:text-base text-gray-400 dark:text-neutral-600 leading-snug md:leading-relaxed">
                                    Kitab Hadits Lainnya Menyusul.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
