"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Surah {
    id_surah: number;
    title: string;
    title_ar: string;
    verse_count: number;
    place: string;
    type: string;
}

export default function QuranPage() {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState<'surah' | 'juz'>('surah');

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const { data, error } = await supabase
                    .from('daftar_surah')
                    .select('*')
                    .order('id_surah', { ascending: true });

                if (error) {
                    console.error("Error fetching surahs:", error);
                } else {
                    setSurahs(data || []);
                }
            } catch (error) {
                console.error("Gagal mengambil data surat", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSurahs();
    }, []);

    const filteredSurahs = surahs.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.id_surah.toString() === search
    );

    const juzList = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        title: `Juz ${i + 1}`,
        desc: `Bagian ${i + 1}`
    }));

    const filteredJuz = juzList.filter(j =>
        j.title.toLowerCase().includes(search.toLowerCase()) ||
        j.id.toString() === search
    );

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black pt-16 pb-20">
            {/* Header Sticky - Added to match Mufrodat style */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="w-10"></div> {/* Spacer for alignment if needed, or just remove flex */}

                    <div className="text-center">
                        <h1 className="font-bold text-gray-900 dark:text-white">
                            Al-Quran
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Mushaf Digital
                        </p>
                    </div>

                    <Link href="/quran/game" className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                        <Sparkles className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Floating Tab Switcher (Mobile: Bottom-Right, Desktop: Top-Right) */}
            <div className="fixed z-50 transition-all duration-300 right-4 bottom-24 md:bottom-auto md:top-24">
                <div className="flex p-1 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md rounded-full shadow-2xl border border-gray-200 dark:border-neutral-800">
                    <button
                        onClick={() => setActiveTab('surah')}
                        className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${activeTab === 'surah'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                    >
                        Surat
                    </button>
                    <button
                        onClick={() => setActiveTab('juz')}
                        className={`px-4 py-2 text-xs font-bold rounded-full transition-all ${activeTab === 'juz'
                            ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                            }`}
                    >
                        Juz
                    </button>
                </div>
            </div>

            {/* Standardized Hero (Hadits Model) */}
            <div className="relative overflow-hidden pt-6 pb-8 md:pt-8 md:pb-12">
                <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none"></div>

                <div className="relative max-w-5xl mx-auto px-4 text-center space-y-3 md:space-y-6">

                    {/* Description */}
                    <p className="text-xs md:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed px-4">
                        Baca dan pelajari ayat suci Al-Quran dengan terjemahan bahasa Indonesia.
                    </p>

                    {/* Integrated Search Bar */}
                    <div className="relative w-full max-w-xl mx-auto group px-2 pt-2 md:pt-4">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                            <Search className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder={activeTab === 'surah' ? "Cari surat atau nomer..." : "Cari Juz..."}
                            className="w-full pl-11 pr-4 py-3 md:py-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm md:text-base text-gray-800 dark:text-gray-200 placeholder-gray-500 shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Stats Only */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-2">
                        <div className="flex items-center gap-4 text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-widest">
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>114 Surat</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                <span>30 Juz</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className="max-w-7xl mx-auto px-4 pb-20">
                {activeTab === 'surah' ? (
                    loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="h-40 bg-white dark:bg-neutral-900/50 rounded-[2rem] border border-gray-200 dark:border-neutral-800 animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {/* Surah List */}
                            {filteredSurahs.map((surah) => (
                                <div
                                    key={surah.id_surah}
                                    className="group bg-white dark:bg-neutral-900 border border-gray-200/60 dark:border-neutral-800 rounded-[2rem] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 flex flex-col relative overflow-hidden active:scale-[0.98] active:border-emerald-500"
                                >
                                    {/* Top Section: Info - Clickable Link */}
                                    <Link
                                        href={`/quran/${surah.id_surah}`}
                                        className="p-4 flex items-center gap-3 relative z-0 flex-grow hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                                    >
                                        {/* Number */}
                                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border-2 border-dashed border-gray-200 dark:border-neutral-700 group-hover:border-emerald-500 group-hover:rotate-45 transition-all duration-500">
                                            <span className="font-bold text-sm text-gray-800 dark:text-gray-200 -rotate-45 group-hover:rotate-0 transition-transform duration-500">
                                                {surah.id_surah}
                                            </span>
                                        </div>

                                        {/* Text Content */}
                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-emerald-500 transition-colors">
                                                    {surah.title}
                                                </h3>
                                                <span className="font-arabic text-xl text-emerald-600 dark:text-emerald-500">
                                                    {surah.title_ar}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 font-medium">
                                                {surah.place} • {surah.verse_count} Ayat
                                            </p>
                                        </div>
                                    </Link>

                                    {/* Tafsir Button - Full Width Bottom */}
                                    <Link
                                        href={`/quran/${surah.id_surah}/tafsir`}
                                        className="relative z-10 w-full py-2.5 bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-100 dark:border-neutral-800 text-center text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2 mt-auto"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <span>✨ Baca Tafsir Lengkap</span>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    // JUZ LIST VIEW
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {filteredJuz.map((juz) => (
                            <Link
                                key={juz.id}
                                href={`/quran/juz/${juz.id}`}
                                className="group bg-white dark:bg-neutral-900 border border-gray-200/60 dark:border-neutral-800 rounded-[2rem] p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 flex flex-col items-center justify-center gap-3 relative overflow-hidden active:scale-[0.98] active:border-emerald-500"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Sparkles className="w-16 h-16 text-emerald-500" />
                                </div>

                                <div className="w-14 h-14 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <span className="font-bold text-xl text-emerald-600 dark:text-emerald-400">
                                        {juz.id}
                                    </span>
                                </div>

                                <div className="text-center relative z-10">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">
                                        {juz.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                        Mulai membaca {juz.desc}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
