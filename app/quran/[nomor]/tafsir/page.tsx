"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, BookOpen, Bookmark, Share2, ArrowRight, ArrowLeft } from 'lucide-react';

interface TafsirAyat {
    ayat: number;
    teks: string;
}

interface SurahTafsir {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
    tempatTurun: string;
    arti: string;
    deskripsi: string;
    tafsir: TafsirAyat[];
    suratSelanjutnya: any;
    suratSebelumnya: any;
}

interface AyatReference {
    nomorAyat: number;
    teksArab: string;
}

export default function TafsirPage() {
    const params = useParams();
    const router = useRouter();
    const nomor = params.nomor;

    const [tafsirData, setTafsirData] = useState<SurahTafsir | null>(null);
    const [ayatRefs, setAyatRefs] = useState<AyatReference[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTafsir = async () => {
            setLoading(true);
            try {
                const [tafsirRes, surahRes] = await Promise.all([
                    axios.get(`https://equran.id/api/v2/tafsir/${nomor}`),
                    axios.get(`https://equran.id/api/v2/surat/${nomor}`)
                ]);

                setTafsirData(tafsirRes.data.data);
                setAyatRefs(surahRes.data.data.ayat);
            } catch (error) {
                console.error("Gagal mengambil data tafsir", error);
            } finally {
                setLoading(false);
            }
        };

        if (nomor) fetchTafsir();
    }, [nomor]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Membuka Kitab Tafsir...</p>
                </div>
            </div>
        );
    }

    if (!tafsirData) return null;

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] pt-16 pb-20">
            {/* Header Sticky */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-emerald-500 transition-colors font-medium group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Kembali</span>
                    </button>

                    <div className="text-center">
                        <h1 className="font-bold text-gray-900 dark:text-white truncate max-w-[150px] sm:max-w-none">
                            Tafsir {tafsirData.namaLatin}
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">QS. {tafsirData.nomor}: {tafsirData.jumlahAyat} AYAT</p>
                    </div>

                    <Link
                        href={`/quran/${tafsirData.nomor}`}
                        className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                    >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Baca Mushaf</span>
                    </Link>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
                {/* Introduction Section */}
                <div className="bg-white dark:bg-neutral-900/50 rounded-[2.5rem] p-8 md:p-12 mb-12 border border-gray-100 dark:border-neutral-800 shadow-xl shadow-black/[0.02] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                    <div className="relative space-y-6 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="space-y-1">
                                <h2 className="text-3xl md:text-5xl font-arabic text-emerald-600 dark:text-emerald-500">{tafsirData.nama}</h2>
                                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">{tafsirData.namaLatin}</h3>
                            </div>
                            <div className="flex items-center justify-center md:justify-end gap-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest border-t md:border-t-0 md:border-l border-gray-100 dark:border-neutral-800 pt-4 md:pt-0 md:pl-6">
                                <span>{tafsirData.tempatTurun}</span>
                                <span className="w-1 h-1 bg-gray-300 dark:bg-neutral-700 rounded-full"></span>
                                <span>{tafsirData.arti}</span>
                            </div>
                        </div>

                        <div className="prose prose-emerald dark:prose-invert max-w-none">
                            <div
                                className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base"
                                dangerouslySetInnerHTML={{ __html: tafsirData.deskripsi }}
                            />
                        </div>
                    </div>
                </div>

                {/* Tafsir List */}
                <div className="space-y-8 md:space-y-12">
                    {tafsirData.tafsir.map((t, index) => {
                        const referenceAyat = ayatRefs.find(a => a.nomorAyat === t.ayat);

                        return (
                            <div
                                key={t.ayat}
                                className="group relative"
                            >
                                {/* Verse Indicator */}
                                <div className="absolute -left-2 md:-left-4 top-0 bottom-0 w-1 bg-emerald-500/10 group-hover:bg-emerald-500 transition-colors rounded-full"></div>

                                <div className="pl-6 md:pl-8 space-y-6">
                                    {/* Verse Reference */}
                                    {referenceAyat && (
                                        <div className="bg-gray-50 dark:bg-neutral-900/30 rounded-2xl p-6 border border-gray-100 dark:border-neutral-800/50 mb-4 transition-all group-hover:bg-white dark:group-hover:bg-neutral-900 shadow-sm group-hover:shadow-md">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                                                    {t.ayat}
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Referensi Ayat</span>
                                            </div>
                                            <p className="font-arabic text-2xl md:text-3xl text-gray-900 dark:text-white text-right leading-[2.2]" dir="rtl">
                                                {referenceAyat.teksArab}
                                            </p>
                                        </div>
                                    )}

                                    {/* Tafsir Content */}
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="w-6 h-[2px] bg-emerald-500/30 rounded-full group-hover:w-10 transition-all"></span>
                                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em]">Tafsir Wajiz</span>
                                        </div>
                                        <div className="prose prose-lg prose-emerald dark:prose-invert max-w-none">
                                            <p className="text-gray-800 dark:text-gray-200 leading-[2] text-lg font-medium selection:bg-emerald-100 dark:selection:bg-emerald-900/40">
                                                {t.teks}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-4 pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-[10px] font-bold text-gray-400 hover:text-emerald-500 flex items-center gap-1.5 uppercase tracking-tight">
                                            <Bookmark className="w-3.5 h-3.5" /> Simpan
                                        </button>
                                        <button className="text-[10px] font-bold text-gray-400 hover:text-emerald-500 flex items-center gap-1.5 uppercase tracking-tight">
                                            <Share2 className="w-3.5 h-3.5" /> Bagikan
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Navigation Bottom */}
                <div className="mt-20 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white dark:bg-neutral-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-neutral-800 shadow-xl shadow-black/[0.02]">
                    {tafsirData.suratSebelumnya ? (
                        <Link
                            href={`/quran/${tafsirData.suratSebelumnya.nomor}/tafsir`}
                            className="flex items-center gap-4 group"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-neutral-800 flex items-center justify-center border border-gray-100 dark:border-neutral-700 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                <ArrowLeft className="w-5 h-5" />
                            </div>
                            <div className="text-left">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Sebelumnya</p>
                                <p className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">{tafsirData.suratSebelumnya.namaLatin}</p>
                            </div>
                        </Link>
                    ) : (<div></div>)}

                    {tafsirData.suratSelanjutnya ? (
                        <Link
                            href={`/quran/${tafsirData.suratSelanjutnya.nomor}/tafsir`}
                            className="flex items-center gap-4 group text-right"
                        >
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Selanjutnya</p>
                                <p className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors">{tafsirData.suratSelanjutnya.namaLatin}</p>
                            </div>
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-neutral-800 flex items-center justify-center border border-gray-100 dark:border-neutral-700 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                <ArrowRight className="w-5 h-5" />
                            </div>
                        </Link>
                    ) : (<div></div>)}
                </div>
            </main>
        </div>
    );
}
