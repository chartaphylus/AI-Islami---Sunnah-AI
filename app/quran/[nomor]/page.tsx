"use client";

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    ChevronLeft, Search, Play, Pause,
    Settings2, Volume2, Globe, Languages, MoreVertical
} from 'lucide-react';

interface Ayat {
    nomorAyat: number;
    teksArab: string;
    teksLatin: string;
    teksIndonesia: string;
    audio: { [key: string]: string };
}

interface Surah {
    nomor: number;
    nama: string;
    namaLatin: string;
    jumlahAyat: number;
    tempatTurun: string;
    arti: string;
}

interface SurahDetail extends Surah {
    deskripsi: string;
    audioFull: { [key: string]: string };
    ayat: Ayat[];
    suratSelanjutnya: { nomor: number; nama: string; namaLatin: string } | false;
    suratSebelumnya: { nomor: number; nama: string; namaLatin: string } | false;
}

export default function QuranDetail() {
    const params = useParams();
    const router = useRouter();
    const nomor = params.nomor;

    const [surah, setSurah] = useState<SurahDetail | null>(null);
    const [surahList, setSurahList] = useState<Surah[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchSurah, setSearchSurah] = useState('');

    // Toggles & Settings
    const [showTranslation, setShowTranslation] = useState(true);
    const [showTransliteration, setShowTransliteration] = useState(true);
    const [selectedQari, setSelectedQari] = useState('01'); // Default to first qari
    const [playingAyat, setPlayingAyat] = useState<number | null>(null);
    const [isPlayingFull, setIsPlayingFull] = useState(false);

    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setIsPlayingFull(false);
            setPlayingAyat(null);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = "";
            }
            try {
                const [surahRes, listRes] = await Promise.all([
                    axios.get(`https://equran.id/api/v2/surat/${nomor}`),
                    axios.get('https://equran.id/api/v2/surat')
                ]);
                setSurah(surahRes.data.data);
                setSurahList(listRes.data.data);
            } catch (error) {
                console.error("Gagal mengambil data", error);
            } finally {
                setLoading(false);
            }
        };

        if (nomor) fetchData();
    }, [nomor]);

    const handlePlayAudio = (url: string, ayatNum: number) => {
        if (playingAyat === ayatNum) {
            audioRef.current?.pause();
            setPlayingAyat(null);
        } else {
            if (audioRef.current) {
                setIsPlayingFull(false); // Stop full audio if playing
                audioRef.current.src = url;
                audioRef.current.play();
                setPlayingAyat(ayatNum);
            }
        }
    };

    const handlePlayFullAudio = () => {
        if (!surah) return;

        if (isPlayingFull) {
            audioRef.current?.pause();
            setIsPlayingFull(false);
        } else {
            if (audioRef.current) {
                setPlayingAyat(null); // Stop individual ayah if playing
                audioRef.current.src = surah.audioFull[selectedQari];
                audioRef.current.play();
                setIsPlayingFull(true);
            }
        }
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Menyiapkan Mushaf...</p>
                </div>
            </div>
        );
    }

    if (!surah) return null;

    const filteredSidebar = surahList.filter(s =>
        s.namaLatin.toLowerCase().includes(searchSurah.toLowerCase()) ||
        s.nomor.toString() === searchSurah
    );

    return (
        <div className="flex h-screen bg-white dark:bg-black overflow-hidden pt-16">
            <audio
                ref={audioRef}
                onEnded={() => {
                    setPlayingAyat(null);
                    setIsPlayingFull(false);
                }}
            />

            {/* Sidebar */}
            <aside className="hidden lg:flex flex-col w-80 border-r border-gray-100 dark:border-neutral-900 bg-gray-50/50 dark:bg-neutral-950/50">
                <div className="p-4 border-b border-gray-100 dark:border-neutral-900">
                    <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white px-2">Daftar Surat</h2>
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari surat..."
                            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all shadow-sm"
                            value={searchSurah}
                            onChange={(e) => setSearchSurah(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto px-2 py-4 space-y-1 custom-scrollbar">
                    {filteredSidebar.map((s) => (
                        <Link
                            key={s.nomor}
                            href={`/quran/${s.nomor}`}
                            className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${s.nomor === surah.nomor
                                ? 'bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20'
                                : 'hover:bg-gray-100 dark:hover:bg-neutral-900 border border-transparent'
                                }`}
                        >
                            <div className={`w-8 h-8 rounded-full border border-dashed flex items-center justify-center text-xs font-bold ${s.nomor === surah.nomor
                                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400'
                                : 'border-gray-300 dark:border-neutral-700 text-gray-400'
                                }`}>
                                {s.nomor}
                            </div>
                            <div className="flex-grow min-w-0">
                                <span className={`block font-bold truncate ${s.nomor === surah.nomor ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'
                                    }`}>
                                    {s.namaLatin}
                                </span>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-[10px] text-gray-400 uppercase tracking-tighter transition-opacity duration-300 opacity-80">
                                        {s.tempatTurun} • {s.jumlahAyat} Ayat
                                    </span>
                                </div>
                            </div>
                            <span className="font-amiri text-lg text-emerald-600 dark:text-emerald-500">
                                {s.nama}
                            </span>
                        </Link>
                    ))}
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto px-4 pb-32">
                    {/* Header Card */}
                    <div className="relative mb-4 md:mb-12 animate-in fade-in slide-in-from-top-4 duration-500">
                        <Link
                            href="/quran"
                            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-500 mb-2 md:mb-8 transition-colors font-medium lg:hidden"
                        >
                            <ChevronLeft className="w-4 h-4" /> Kembali
                        </Link>

                        <div className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-neutral-800 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-12 shadow-sm relative overflow-hidden group">
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32"></div>

                            <div className="relative flex flex-col items-center text-center space-y-3 md:space-y-4">
                                <div className="flex items-center gap-3 md:gap-4 text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl border-2 border-dashed border-emerald-500/30 flex items-center justify-center text-lg md:text-xl">
                                        {surah.nomor}
                                    </div>
                                    <span className="text-3xl md:text-5xl font-arabic tracking-wider">{surah.nama}</span>
                                </div>
                                <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                                    {surah.namaLatin} <span className="text-gray-300 dark:text-neutral-700 mx-1 md:mx-2 text-xl md:text-2xl">•</span> {surah.arti}
                                </h1>
                                <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-2 md:mt-4">
                                    <span className="px-3 py-1 bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-full text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                        📍 {surah.tempatTurun}
                                    </span>
                                    <span className="px-3 py-1 bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-full text-[10px] md:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                                        📖 {surah.jumlahAyat} AYAT
                                    </span>
                                    <Link
                                        href={`/quran/${surah.nomor}/tafsir`}
                                        className="px-3 py-1 bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] md:text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all"
                                    >
                                        ✨ Lihat Tafsir
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Controls Sticky */}
                    <div className="sticky top-4 z-20 mb-6 md:mb-12 p-2 md:p-3 bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-gray-100 dark:border-neutral-800 rounded-2xl md:rounded-3xl shadow-xl shadow-black/5 flex items-center justify-between gap-4 overflow-hidden">
                        <div className="flex items-center gap-2 md:gap-4 flex-nowrap overflow-x-auto no-scrollbar px-2 py-1 flex-grow scroll-smooth">
                            {/* Surah Switcher */}
                            <div className="relative flex-shrink-0">
                                <select
                                    value={surah.nomor}
                                    className="appearance-none bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 py-2 pl-3 pr-8 md:py-2.5 md:pl-4 md:pr-10 rounded-xl text-xs md:text-sm font-bold text-emerald-600 dark:text-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
                                    onChange={(e) => {
                                        if (e.target.value) router.push(`/quran/${e.target.value}`);
                                    }}
                                >
                                    {surahList.map(s => (
                                        <option key={s.nomor} value={s.nomor}>{s.nomor}. {s.namaLatin}</option>
                                    ))}
                                </select>
                                <ChevronLeft className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-500 -rotate-90 pointer-events-none" />
                            </div>

                            <div className="relative flex-shrink-0">
                                <select
                                    className="appearance-none bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 py-2 pl-3 pr-8 md:py-2.5 md:pl-4 md:pr-10 rounded-xl text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
                                    onChange={(e) => {
                                        const el = document.getElementById(`ayat-${e.target.value}`);
                                        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                    }}
                                >
                                    <option value="">Ayat</option>
                                    {surah.ayat.map(a => (
                                        <option key={a.nomorAyat} value={a.nomorAyat}>{a.nomorAyat}</option>
                                    ))}
                                </select>
                                <ChevronLeft className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 -rotate-90 pointer-events-none" />
                            </div>

                            <div className="relative flex-shrink-0">
                                <select
                                    value={selectedQari}
                                    onChange={(e) => setSelectedQari(e.target.value)}
                                    className="appearance-none bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 py-2 pl-8 pr-8 md:py-2.5 md:pl-10 md:pr-10 rounded-xl text-xs md:text-sm font-bold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer"
                                >
                                    <option value="01">Abdullah Al-Juhany</option>
                                    <option value="02">Abdurrahman as-Sudais</option>
                                    <option value="03">Abu Bakr ash-Shatri</option>
                                    <option value="04">Hani ar-Rifa'i</option>
                                    <option value="05">Mahmoud Al-Husary</option>
                                </select>
                                <Volume2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500 pointer-events-none" />
                                <ChevronLeft className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 -rotate-90 pointer-events-none" />
                            </div>

                            <div className="flex items-center gap-4 flex-nowrap border-l border-gray-100 dark:border-neutral-800 pl-4">
                                <label className="flex items-center gap-2 cursor-pointer group flex-shrink-0">
                                    <span className={`text-[10px] font-bold uppercase tracking-tight transition-colors ${showTransliteration ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>Latin</span>
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only" checked={showTransliteration} onChange={() => setShowTransliteration(!showTransliteration)} />
                                        <div className={`w-8 h-4 rounded-full transition-colors ${showTransliteration ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-neutral-800'}`}></div>
                                        <div className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full transition-transform ${showTransliteration ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer group flex-shrink-0">
                                    <span className={`text-[10px] font-bold uppercase tracking-tight transition-colors ${showTranslation ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400'}`}>Arti</span>
                                    <div className="relative">
                                        <input type="checkbox" className="sr-only" checked={showTranslation} onChange={() => setShowTranslation(!showTranslation)} />
                                        <div className={`w-8 h-4 rounded-full transition-colors ${showTranslation ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-neutral-800'}`}></div>
                                        <div className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full transition-transform ${showTranslation ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button
                            onClick={handlePlayFullAudio}
                            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 border-l border-gray-100 dark:border-neutral-800 font-bold text-xs md:text-sm transition-all ${isPlayingFull ? 'text-emerald-500 bg-emerald-500/5' : 'text-emerald-600 dark:text-emerald-400 hover:opacity-80'}`}
                        >
                            {isPlayingFull ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                            {isPlayingFull ? 'Stop Audio' : 'Play Audio'}
                        </button>
                    </div>

                    {/* Verses Container */}
                    <div className={`space-y-4 md:space-y-6 mb-10`}>
                        {/* Basmalah */}
                        {surah.nomor !== 1 && surah.nomor !== 9 && (
                            <div className="text-center py-4 md:py-10 animate-in fade-in zoom-in duration-700">
                                <p className="font-arabic text-3xl md:text-5xl text-gray-900 dark:text-white tracking-widest">
                                    بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
                                </p>
                            </div>
                        )}

                        {surah.ayat.map((a) => (
                            <div
                                key={a.nomorAyat}
                                id={`ayat-${a.nomorAyat}`}
                                className={`group bg-white dark:bg-[#080808] border border-gray-100 dark:border-neutral-900 rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 transition-all duration-300 hover:border-emerald-500/30 scroll-mt-32 ${!showTranslation && !showTransliteration ? 'py-4 md:py-6' : ''}`}
                            >
                                <div className="flex flex-col gap-6 md:gap-8">
                                    {/* verse content - Top (Arabic) */}
                                    <div className={`${!showTranslation && !showTransliteration ? 'space-y-0' : 'space-y-8'}`}>
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex flex-col items-center gap-2">
                                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-xs md:text-sm">
                                                    {a.nomorAyat}
                                                </div>
                                            </div>
                                            <p className="font-arabic text-4xl md:text-6xl text-gray-900 dark:text-white text-right leading-[2.2] md:leading-[2.5] select-all group-hover:text-emerald-500 transition-colors duration-500 flex-grow" dir="rtl">
                                                {a.teksArab}
                                            </p>
                                        </div>

                                        <div className="space-y-4 md:space-y-6">
                                            {showTransliteration && (
                                                <div className="flex gap-3 md:gap-4">
                                                    <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500 mt-1 flex-shrink-0" />
                                                    <p className="text-emerald-700 dark:text-emerald-400 text-base md:text-lg font-medium italic leading-relaxed">
                                                        {a.teksLatin}
                                                    </p>
                                                </div>
                                            )}

                                            {showTranslation && (
                                                <div className="flex gap-3 md:gap-4">
                                                    <Languages className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500 mt-1 flex-shrink-0" />
                                                    <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg leading-loose font-medium">
                                                        {a.teksIndonesia}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons - Bottom */}
                                    <div className="flex items-center gap-2 pt-4 border-t border-gray-50 dark:border-neutral-900">
                                        <button
                                            onClick={() => handlePlayAudio(a.audio[selectedQari], a.nomorAyat)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${playingAyat === a.nomorAyat ? 'bg-emerald-500 text-white' : 'bg-gray-50 dark:bg-neutral-900 text-gray-500 hover:text-emerald-500'}`}
                                        >
                                            {playingAyat === a.nomorAyat ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                                            {playingAyat === a.nomorAyat ? 'Pause' : 'Play'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Nav */}
                    <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-gray-50 dark:bg-neutral-900 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-gray-100 dark:border-neutral-800">
                        {surah.suratSebelumnya ? (
                            <Link
                                href={`/quran/${surah.suratSebelumnya.nomor}`}
                                className="flex items-center gap-4 md:gap-5 group"
                            >
                                <div className="p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm">
                                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">Sebelumnya</p>
                                    <p className="text-base md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors truncate max-w-[120px] md:max-w-none">
                                        {surah.suratSebelumnya.namaLatin}
                                    </p>
                                </div>
                            </Link>
                        ) : <div></div>}

                        {surah.suratSelanjutnya ? (
                            <Link
                                href={`/quran/${surah.suratSelanjutnya.nomor}`}
                                className="flex items-center justify-end gap-4 md:gap-5 group text-right"
                            >
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">Selanjutnya</p>
                                    <p className="text-base md:text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-500 transition-colors truncate max-w-[120px] md:max-w-none">
                                        {surah.suratSelanjutnya.namaLatin}
                                    </p>
                                </div>
                                <div className="p-3 md:p-4 rounded-2xl md:rounded-3xl bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all shadow-sm rotate-180">
                                    <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                                </div>
                            </Link>
                        ) : <div></div>}
                    </div>
                </div>
            </main>
        </div>
    );
}
