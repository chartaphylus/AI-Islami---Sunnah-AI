"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface Ayat {
    nomorAyat: number;
    teksArab: string;
    teksLatin: string;
    teksIndonesia: string;
}

interface SurahDetail {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
    arti: string;
    deskripsi: string;
    ayat: Ayat[];
    suratSelanjutnya: { nomor: number; nama: string; namaLatin: string } | false;
    suratSebelumnya: { nomor: number; nama: string; namaLatin: string } | false;
}

export default function QuranDetail() {
    const params = useParams();
    const router = useRouter();
    const nomor = params.nomor;

    const [surah, setSurah] = useState<SurahDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!nomor) return;

        const fetchSurah = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`https://equran.id/api/v2/surat/${nomor}`);
                setSurah(res.data.data);
            } catch (error) {
                console.error("Gagal mengambil detail surat", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSurah();
    }, [nomor]);

    if (loading) {
        return (
            <div className="min-h-screen pt-24 px-4 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    if (!surah) {
        return (
            <div className="min-h-screen pt-24 px-4 text-center">
                <h2 className="text-xl font-bold text-red-500">Surat tidak ditemukan</h2>
                <Link href="/quran" className="text-emerald-500 hover:underline mt-4 block">Kembali ke Daftar Surat</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-4 pb-20 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10 animate-in fade-in slide-in-from-top-5">
                <Link href="/quran" className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-500 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Daftar
                </Link>
                <div className="glass-card rounded-3xl p-8 relative overflow-hidden">
                    <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-3xl"></div>
                    <h1 className="text-4xl font-amiri mb-2 text-gray-900 dark:text-white">{surah.nama}</h1>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{surah.namaLatin}</h2>
                    <p className="text-gray-500 dark:text-gray-400">{surah.arti} • {surah.jumlahAyat} Ayat</p>
                </div>
            </div>

            {/* Bismillah */}
            {surah.nomor !== 1 && surah.nomor !== 9 && (
                <div className="text-center mb-12">
                    <span className="font-amiri text-3xl text-gray-800 dark:text-gray-200">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيم</span>
                </div>
            )}

            {/* Verses */}
            <div className="space-y-6">
                {surah.ayat.map((ayat, idx) => (
                    <div key={ayat.nomorAyat} className="glass-card rounded-2xl p-6 hover:shadow-emerald-500/10 transition-all border-l-4 border-l-transparent hover:border-l-emerald-500">
                        <div className="flex justify-between items-start mb-6">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-500 dark:text-gray-400 text-xs font-bold">
                                {ayat.nomorAyat}
                            </span>
                            <div className="text-right w-full pl-10">
                                <p className="font-arabic text-2xl md:text-3xl leading-[2.5] text-black dark:text-white font-normal" dir="rtl">
                                    {ayat.teksArab}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-emerald-700 dark:text-emerald-400 font-semibold italic text-sm">
                                {ayat.teksLatin}
                            </p>
                            <p className="text-gray-900 dark:text-gray-100 leading-relaxed font-medium">
                                {ayat.teksIndonesia}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-12">
                {surah.suratSebelumnya ? (
                    <Link href={`/quran/${surah.suratSebelumnya.nomor}`} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 hover:border-emerald-500 transition-all">
                        <ArrowLeft className="w-4 h-4" />
                        <div className="text-left">
                            <div className="text-xs text-gray-400">Sebelumnya</div>
                            <div className="font-bold text-sm">{surah.suratSebelumnya.namaLatin}</div>
                        </div>
                    </Link>
                ) : <div></div>}

                {surah.suratSelanjutnya ? (
                    <Link href={`/quran/${surah.suratSelanjutnya.nomor}`} className="flex items-center gap-2 px-6 py-3 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 hover:border-emerald-500 transition-all">
                        <div className="text-right">
                            <div className="text-xs text-gray-400">Selanjutnya</div>
                            <div className="font-bold text-sm">{surah.suratSelanjutnya.namaLatin}</div>
                        </div>
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                ) : <div></div>}
            </div>
        </div>
    );
}
