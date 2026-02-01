"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Search, BookOpen } from 'lucide-react';

interface Surah {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
    tempatTurun: string;
    arti: string;
}

export default function QuranPage() {
    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchSurahs = async () => {
            try {
                const res = await axios.get('https://equran.id/api/v2/surat');
                setSurahs(res.data.data);
            } catch (error) {
                console.error("Gagal mengambil data surat", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSurahs();
    }, []);

    const filteredSurahs = surahs.filter(s =>
        s.namaLatin.toLowerCase().includes(search.toLowerCase()) ||
        s.arti.toLowerCase().includes(search.toLowerCase()) ||
        s.nomor.toString() === search
    );

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black pt-16">
            {/* Standardized Hero (Hadits Model) */}
            <div className="relative overflow-hidden pt-6 pb-8 md:pt-12 md:pb-20">
                <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none"></div>

                <div className="relative max-w-5xl mx-auto px-4 text-center space-y-3 md:space-y-6">
                    {/* Top Pill Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 text-[10px] md:text-xs font-bold uppercase tracking-widest">
                        <BookOpen className="w-3 h-3 md:w-4 md:h-4" />
                        <span>Mushaf Digital</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                        Al-Quran
                    </h1>

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
                            placeholder="Cari surat, nomer, atau arti..."
                            className="w-full pl-11 pr-4 py-3 md:py-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm md:text-base text-gray-800 dark:text-gray-200 placeholder-gray-500 shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {/* Stats Only - Game Button Moved to Grid */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-2">
                        <div className="flex items-center gap-4 text-[10px] md:text-sm font-bold text-gray-400 uppercase tracking-widest">
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span>114 Surat</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                <span>6.236 Ayat</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className="max-w-7xl mx-auto px-4 pb-20">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="h-40 bg-white dark:bg-neutral-900/50 rounded-[2rem] border border-gray-200 dark:border-neutral-800 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {/* Game Card - First Item */}
                        <div className="group bg-white dark:bg-neutral-900 border border-orange-200/60 dark:border-orange-900/30 rounded-[2rem] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-orange-500/10 hover:border-orange-500/30 flex flex-col relative overflow-hidden">
                            <Link
                                href="/quran/game"
                                className="p-4 flex items-center gap-3 relative z-0 flex-grow hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors"
                            >
                                {/* Icon Badge */}
                                <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-500">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </div>

                                {/* Text Content */}
                                <div className="flex-grow min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-orange-500 transition-colors">
                                            Uji Hafalan
                                        </h3>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 font-medium">
                                        Asah hafalan Al-Qur'anmu dengan kuis interaktif
                                    </p>
                                </div>
                            </Link>

                            {/* Action Button */}
                            <Link
                                href="/quran/game"
                                className="relative z-10 w-full py-2.5 bg-orange-50 dark:bg-orange-900/20 border-t border-orange-100 dark:border-orange-800 text-center text-orange-600 dark:text-orange-400 text-[10px] font-bold uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-2 mt-auto"
                            >
                                <span>🎮 Mulai Sekarang</span>
                            </Link>
                        </div>

                        {/* Surah List */}
                        {filteredSurahs.map((surah) => (
                            <div
                                key={surah.nomor}
                                className="group bg-white dark:bg-neutral-900 border border-gray-200/60 dark:border-neutral-800 rounded-[2rem] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 flex flex-col relative overflow-hidden"
                            >
                                {/* Top Section: Info - Clickable Link */}
                                <Link
                                    href={`/quran/${surah.nomor}`}
                                    className="p-4 flex items-center gap-3 relative z-0 flex-grow hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                                >
                                    {/* Number */}
                                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border-2 border-dashed border-gray-200 dark:border-neutral-700 group-hover:border-emerald-500 group-hover:rotate-45 transition-all duration-500">
                                        <span className="font-bold text-sm text-gray-800 dark:text-gray-200 -rotate-45 group-hover:rotate-0 transition-transform duration-500">
                                            {surah.nomor}
                                        </span>
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-emerald-500 transition-colors">
                                                {surah.namaLatin}
                                            </h3>
                                            <span className="font-arabic text-xl text-emerald-600 dark:text-emerald-500">
                                                {surah.nama}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 font-medium">
                                            {surah.arti} • {surah.tempatTurun} • {surah.jumlahAyat} Ayat
                                        </p>
                                    </div>
                                </Link>

                                {/* Tafsir Button - Full Width Bottom */}
                                <Link
                                    href={`/quran/${surah.nomor}/tafsir`}
                                    className="relative z-10 w-full py-2.5 bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-100 dark:border-neutral-800 text-center text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2 mt-auto"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <span>✨ Baca Tafsir Lengkap</span>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
