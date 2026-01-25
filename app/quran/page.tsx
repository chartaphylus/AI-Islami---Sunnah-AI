"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

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
    const [activeTab, setActiveTab] = useState<'quran' | 'dua'>('quran');

    // Doa API State
    const [doaList, setDoaList] = useState<any[]>([]);
    const [loadingDoa, setLoadingDoa] = useState(false);
    const [searchDoa, setSearchDoa] = useState('');

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

    // Fetch Doa when tab changes to 'dua' and list is empty
    useEffect(() => {
        if (activeTab === 'dua' && doaList.length === 0) {
            const fetchDoa = async () => {
                setLoadingDoa(true);
                try {
                    const res = await axios.get('https://open-api.my.id/api/doa');
                    setDoaList(res.data);
                } catch (error) {
                    console.error("Gagal mengambil data doa", error);
                } finally {
                    setLoadingDoa(false);
                }
            };
            fetchDoa();
        }
    }, [activeTab, doaList.length]);

    const filteredSurahs = surahs.filter(s =>
        s.namaLatin.toLowerCase().includes(search.toLowerCase()) ||
        s.arti.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen px-4 max-w-5xl mx-auto pb-10 pt-8">
            <div className="text-center mb-8 space-y-2">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Al-Qur'an & Doa</h1>
                <p className="text-gray-500 dark:text-gray-400">Baca Al-Qur'an dan Kumpulan Doa Harian</p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="bg-gray-100 dark:bg-neutral-800 p-1 rounded-xl inline-flex">
                    <button
                        onClick={() => setActiveTab('quran')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'quran' ? 'bg-white dark:bg-neutral-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        Al-Qur'an
                    </button>
                    <button
                        onClick={() => setActiveTab('dua')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'dua' ? 'bg-white dark:bg-neutral-700 shadow-sm text-emerald-600 dark:text-emerald-400' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                    >
                        Doa & Dzikir
                    </button>
                </div>
            </div>

            {activeTab === 'quran' ? (
                <>
                    {/* Search */}
                    <div className="relative max-w-md mx-auto mb-10">
                        <input
                            type="text"
                            placeholder="Cari surat..."
                            className="w-full px-5 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[...Array(9)].map((_, i) => (
                                <div key={i} className="h-32 bg-gray-100 dark:bg-neutral-800 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredSurahs.map((surah) => (
                                <Link href={`/quran/${surah.nomor}`} key={surah.nomor} className="group p-5 bg-white dark:bg-neutral-900 hover:bg-emerald-50 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-800 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/10 cursor-pointer block">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                                            {surah.nomor}
                                        </span>
                                        <span className="font-amiri text-xl text-black dark:text-white font-bold">{surah.nama}</span>
                                    </div>
                                    <h3 className="font-bold text-lg text-black dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                        {surah.namaLatin}
                                    </h3>
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                                        <span>{surah.arti}</span>
                                        <span>{surah.jumlahAyat} Ayat</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <div className="animate-in fade-in slide-in-from-bottom-2">
                    {/* Search Doa */}
                    <div className="relative max-w-md mx-auto mb-8">
                        <input
                            type="text"
                            placeholder="Cari doa harian..."
                            className="w-full px-5 py-3 rounded-xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 focus:ring-2 focus:ring-emerald-500 outline-none transition-all shadow-sm"
                            value={searchDoa}
                            onChange={(e) => setSearchDoa(e.target.value)}
                        />
                    </div>

                    {loadingDoa ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-40 bg-gray-100 dark:bg-neutral-800 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {doaList
                                .filter(d => d.judul.toLowerCase().includes(searchDoa.toLowerCase()))
                                .map((doa: any) => (
                                    <div key={doa.id} className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all">
                                        <h3 className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mb-4 border-b border-gray-100 dark:border-neutral-800 pb-2">{doa.judul}</h3>
                                        <p className="font-arabic text-2xl md:text-3xl text-right leading-loose mb-6 text-gray-900 dark:text-white" dir="rtl">{doa.arab}</p>
                                        <p className="text-sm text-emerald-700 dark:text-emerald-300 italic mb-2 font-medium">{doa.latin}</p>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">"{doa.terjemah}"</p>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
