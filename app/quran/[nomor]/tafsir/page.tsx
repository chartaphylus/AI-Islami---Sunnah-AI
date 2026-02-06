"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, BookOpen, Check, Copy, MessageCircle, List, ArrowLeft, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { fetchSurahTafsir } from '@/lib/external-api';

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

// Sub-component for individual Tafsir items to handle independent states
const TafsirItem = ({
    tafsir,
    referenceAyat,
    surahName
}: {
    tafsir: TafsirAyat,
    referenceAyat?: AyatReference,
    surahName: string
}) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        const textToCopy = `*Tafsir ${surahName} Ayat ${tafsir.ayat}*\n\n${referenceAyat ? `${referenceAyat.teksArab}\n\n` : ''}*Tafsir Ringkas:*\n${tafsir.teks}\n\n_Sumber: AI Islami_`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShareWhatsApp = () => {
        const textToShare = `*Tafsir ${surahName} Ayat ${tafsir.ayat}*\n\n${referenceAyat ? `${referenceAyat.teksArab}\n\n` : ''}*Tafsir Ringkas:*\n${tafsir.teks}\n\n_Sumber: AI Islami_`;
        const url = `https://wa.me/?text=${encodeURIComponent(textToShare)}`;
        window.open(url, '_blank');
    };

    return (
        <div id={`ayat-${tafsir.ayat}`} className="group relative bg-white dark:bg-neutral-900/50 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all scroll-mt-32 active:scale-[0.99] active:bg-emerald-50/50">
            {/* Decoration */}
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-l-3xl"></div>

            <div className="space-y-6">
                {/* Header: Verse Number & Reference */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm border border-emerald-100 dark:border-emerald-800">
                            {tafsir.ayat}
                        </div>
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Ayat {tafsir.ayat}</span>
                    </div>
                </div>

                {/* Arabic Reference */}
                {referenceAyat && (
                    <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-neutral-800/50">
                        <p className="font-arabic text-2xl md:text-3xl lg:text-4xl text-gray-900 dark:text-white text-right leading-[2.2] md:leading-[2.4]" dir="rtl">
                            {referenceAyat.teksArab}
                        </p>
                    </div>
                )}

                {/* Tafsir Content */}
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="h-4 w-1 bg-emerald-500 rounded-full"></div>
                        <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide">Tafsir Ringkas</h4>
                    </div>

                    <div className="prose prose-lg prose-emerald dark:prose-invert max-w-none">
                        {tafsir.teks.split('\n').filter(p => p.trim() !== "").map((paragraph, idx) => (
                            <p key={idx} className="text-justify leading-loose text-gray-600 dark:text-gray-300 mb-6 last:mb-0 indent-8">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 pt-6 border-t border-gray-100 dark:border-neutral-800">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-all text-xs font-bold uppercase tracking-wider"
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4" />
                                <span>Disalin</span>
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                <span>Salin</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleShareWhatsApp}
                        className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-[#25D366]/10 hover:text-[#25D366] transition-all text-xs font-bold uppercase tracking-wider"
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span>WhatsApp</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function TafsirPage() {
    const params = useParams();
    const router = useRouter();
    const nomor = Number(params.nomor);

    const [tafsirData, setTafsirData] = useState<SurahTafsir | null>(null);
    const [ayatRefs, setAyatRefs] = useState<AyatReference[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedAyat, setSelectedAyat] = useState<string>("");

    // Support picking edition if multiple
    const [availableEditions, setAvailableEditions] = useState<string[]>([]);
    const [selectedEdition, setSelectedEdition] = useState<string>("");

    useEffect(() => {
        const fetchTafsir = async () => {
            if (!nomor) return;
            setLoading(true);
            try {
                // 1. Fetch from equran.id API first
                const apiTafsir = await fetchSurahTafsir(nomor);

                // 2. Fetch from Supabase for additional editions
                const { data: tafsirRaw, error: tafsirError } = await supabase
                    .from('tafsir_quran')
                    .select('*')
                    .eq('surah_id', nomor);

                if (tafsirError) throw tafsirError;

                // 3. Fetch Surah Metadata (for navigation and names)
                const { data: allSurahs } = await supabase
                    .from('daftar_surah')
                    .select('*')
                    .order('id_surah');

                const currentSurahMeta = allSurahs?.find((s: any) => s.id_surah === nomor);
                const prevSurah = allSurahs?.find((s: any) => s.id_surah === nomor - 1);
                const nextSurah = allSurahs?.find((s: any) => s.id_surah === nomor + 1);

                // 4. Fetch Verses for Reference (Arabic text)
                const { data: versesData, error: versesError } = await supabase
                    .from('ayat_quran')
                    .select('verse_number, text_ar')
                    .eq('surah_id', nomor)
                    .order('verse_number');

                if (versesError) throw versesError;

                // Handle Editions Merge
                const supabaseEditions = Array.from(new Set(tafsirRaw?.map(t => t.edition_id) || [])) as string[];
                const allEditions = ["Kemenag (equran.id)", ...supabaseEditions];
                setAvailableEditions(allEditions);

                let currentEdition = selectedEdition;
                if (!currentEdition && allEditions.length > 0) {
                    currentEdition = allEditions[0];
                    setSelectedEdition(currentEdition);
                }

                let parsedTafsir: TafsirAyat[] = [];

                if (currentEdition === "Kemenag (equran.id)") {
                    parsedTafsir = apiTafsir.tafsir.map((t: any) => ({
                        ayat: t.ayat,
                        teks: t.teks
                    }));
                } else {
                    const editionData = tafsirRaw?.find(t => t.edition_id === currentEdition);
                    if (editionData && editionData.content) {
                        const content = editionData.content;
                        if (Array.isArray(content)) {
                            parsedTafsir = content.map((item: any, idx: number) => ({
                                ayat: item.verse || idx + 1,
                                teks: item.text || item
                            }));
                        } else if (typeof content === 'object') {
                            parsedTafsir = Object.keys(content).map(key => ({
                                ayat: Number(key),
                                teks: content[key]
                            }));
                        }
                    }
                }

                // Sort by ayat
                parsedTafsir.sort((a, b) => a.ayat - b.ayat);

                setTafsirData({
                    nomor: apiTafsir.nomor || nomor,
                    nama: apiTafsir.nama || currentSurahMeta?.title_ar || "",
                    namaLatin: apiTafsir.namaLatin || currentSurahMeta?.title || "",
                    jumlahAyat: apiTafsir.jumlahAyat || currentSurahMeta?.verse_count || 0,
                    tempatTurun: apiTafsir.tempatTurun || currentSurahMeta?.place || "",
                    arti: apiTafsir.arti || "",
                    deskripsi: apiTafsir.deskripsi || "",
                    tafsir: parsedTafsir,
                    suratSebelumnya: prevSurah ? { nomor: prevSurah.id_surah, namaLatin: prevSurah.title } : null,
                    suratSelanjutnya: nextSurah ? { nomor: nextSurah.id_surah, namaLatin: nextSurah.title } : null
                });

                setAyatRefs((versesData || []).map((v: any) => ({
                    nomorAyat: v.verse_number,
                    teksArab: v.text_ar
                })));

            } catch (error) {
                console.error("Gagal mengambil data tafsir", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTafsir();
    }, [nomor, selectedEdition]);

    const handleAyatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const ayat = e.target.value;
        setSelectedAyat(ayat);
        if (ayat) {
            const element = document.getElementById(`ayat-${ayat}`);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    };

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

            {/* Desktop Only: Sticky Sub-Header Controls */}
            <div className="hidden md:block sticky top-16 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-900 shadow-sm transition-all">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">

                    {/* Tafsir Source Selector */}
                    <div className="flex-1 min-w-0 flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                            Pilih Kitab Tafsir:
                        </span>
                        <div className="relative min-w-[200px]">
                            <select
                                value={selectedEdition}
                                onChange={(e) => setSelectedEdition(e.target.value)}
                                className="w-full appearance-none bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white text-xs font-bold rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            >
                                {availableEditions.map(ed => (
                                    <option key={ed} value={ed}>{ed}</option>
                                ))}
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {/* Verse Selector */}
                    <div className="flex-none flex items-center gap-3 justify-end">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
                            Pilih Ayat:
                        </span>
                        <div className="relative min-w-[120px]">
                            <select
                                value={selectedAyat}
                                onChange={handleAyatChange}
                                className="w-full appearance-none bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white text-xs font-bold rounded-lg px-3 py-2 pr-8 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
                            >
                                <option value="">Semua Ayat</option>
                                {tafsirData.tafsir.map((t) => (
                                    <option key={t.ayat} value={t.ayat}>Ayat {t.ayat}</option>
                                ))}
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <List className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Mobile Only: Floating Bottom Controls */}
            <div className="md:hidden fixed bottom-24 right-4 z-50 flex flex-col gap-3 items-end pointer-events-none">
                {/* Verse Selector (Top) */}
                <div className="pointer-events-auto flex flex-col items-end">
                    <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 mr-1 bg-white/80 dark:bg-black/50 backdrop-blur px-2 py-0.5 rounded-md shadow-sm">
                        Pilih Ayat
                    </span>
                    <div className="bg-emerald-500 text-white p-1.5 rounded-xl shadow-lg shadow-emerald-500/30 max-w-[140px]">
                        <div className="relative">
                            <select
                                value={selectedAyat}
                                onChange={handleAyatChange}
                                className="w-full appearance-none bg-transparent text-white text-xs font-bold pl-2 pr-8 py-1.5 focus:outline-none placeholder-white/70"
                            >
                                <option value="" className="text-gray-900">Ayat..</option>
                                {tafsirData.tafsir.map((t) => (
                                    <option key={t.ayat} value={t.ayat} className="text-gray-900">Ayat {t.ayat}</option>
                                ))}
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <List className="w-3.5 h-3.5 text-white" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tafsir Selector (Bottom) */}
                <div className="pointer-events-auto flex flex-col items-end">
                    <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 mr-1 bg-white/80 dark:bg-black/50 backdrop-blur px-2 py-0.5 rounded-md shadow-sm">
                        Pilih Tafsir
                    </span>
                    <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md p-1.5 rounded-xl shadow-lg border border-gray-200 dark:border-neutral-800 max-w-[200px]">
                        <div className="relative">
                            <select
                                value={selectedEdition}
                                onChange={(e) => setSelectedEdition(e.target.value)}
                                className="w-full appearance-none bg-transparent text-gray-900 dark:text-white text-xs font-bold pl-2 pr-8 py-1.5 focus:outline-none"
                            >
                                {availableEditions.map(ed => (
                                    <option key={ed} value={ed}>{ed}</option>
                                ))}
                            </select>
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                                <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                            </div>
                        </div>
                    </div>
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
                    </div>
                </div>

                {/* Tafsir List */}
                <div className="space-y-8">
                    {tafsirData.tafsir.length > 0 ? (
                        tafsirData.tafsir.map((t) => (
                            <TafsirItem
                                key={t.ayat}
                                tafsir={t}
                                referenceAyat={ayatRefs.find(a => a.nomorAyat === t.ayat)}
                                surahName={tafsirData.namaLatin}
                            />
                        ))
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            Belum ada data tafsir untuk edisi ini.
                        </div>
                    )}
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
