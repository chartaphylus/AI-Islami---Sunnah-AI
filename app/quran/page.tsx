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
            {/* Hero Section */}
            <div className="relative overflow-hidden pt-6 pb-12 md:pt-12 md:pb-20">
                <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none"></div>
                <div className="relative max-w-5xl mx-auto px-4 text-center space-y-6">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white flex flex-col md:block items-center justify-center gap-2">
                        Al-Quran
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        Cari berdasarkan nama surat, nomor, atau arti dalam bahasa Indonesia
                    </p>

                    {/* Search Bar */}
                    <div className="relative max-w-2xl mx-auto mt-6 md:mt-8 group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl blur opacity-15 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative flex items-center bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl p-1 shadow-xl">
                            <div className="pl-4 text-gray-400">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Contoh: &quot;Al-Fatihah&quot;, &quot;1&quot;, atau &quot;Pembukaan&quot;"
                                className="w-full px-4 py-4 bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-500 text-lg"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Game CTA */}
                    <div className="flex justify-center mt-6">
                        <Link
                            href="/quran/game"
                            className="group relative inline-flex items-center gap-3 px-8 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl font-bold text-white shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            <span className="relative">Uji Hafalan: Al-Qur'an</span>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap justify-center gap-6 mt-8">
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"></span>
                            <span className="text-gray-700 dark:text-gray-300">114 Surat</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                            <span className="text-gray-700 dark:text-gray-300">6.236 Ayat</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                            <span className="text-gray-700 dark:text-gray-300">30 Juz</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className="max-w-7xl mx-auto px-4">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="h-40 bg-white dark:bg-neutral-900/50 rounded-[2rem] border border-gray-200 dark:border-neutral-800 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
