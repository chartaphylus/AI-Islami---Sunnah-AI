"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft, Play, Pause, AlertCircle, BookOpen, ChevronRight, Menu } from 'lucide-react';
import { fetchVersesByJuz, Verse } from '@/lib/quran-api-v4';
import { motion, AnimatePresence } from 'framer-motion';

interface PageGroup {
    pageNumber: number;
    verses: Verse[];
}

export default function JuzPage() {
    const params = useParams();
    const router = useRouter();
    const juzId = Number(params.id);

    const [verses, setVerses] = useState<Verse[]>([]);
    const [pages, setPages] = useState<PageGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Pagination State
    const [currentPageIndex, setCurrentPageIndex] = useState(0);
    const [direction, setDirection] = useState(0); // -1 for left (prev), 1 for right (next)
    const [showPageMenu, setShowPageMenu] = useState(false);

    // Audio State
    const [playingVerseKey, setPlayingVerseKey] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Reset pagination when Juz changes
    useEffect(() => {
        setCurrentPageIndex(0);
    }, [juzId]);

    useEffect(() => {
        const loadJuzData = async () => {
            if (!juzId) return;
            setLoading(true);
            setError(null);

            try {
                const data = await fetchVersesByJuz(juzId);
                setVerses(data.verses);

                // Group by Page
                const grouped = data.verses.reduce((acc: PageGroup[], verse) => {
                    const lastGroup = acc[acc.length - 1];
                    if (lastGroup && lastGroup.pageNumber === verse.page_number) {
                        lastGroup.verses.push(verse);
                    } else {
                        acc.push({
                            pageNumber: verse.page_number,
                            verses: [verse]
                        });
                    }
                    return acc;
                }, []);

                setPages(grouped);
            } catch (err) {
                console.error("Failed to load Juz:", err);
                setError("Gagal memuat data Juz. Pastikan koneksi internet lancar.");
            } finally {
                setLoading(false);
            }
        };

        loadJuzData();
    }, [juzId]);

    const handlePlayAudio = (url: string | undefined, verseKey: string) => {
        if (!url) {
            alert("Audio tidak tersedia untuk ayat ini");
            return;
        }

        const fullUrl = url.startsWith('http') ? url : `https://verses.quran.com/${url}`;

        if (playingVerseKey === verseKey) {
            audioRef.current?.pause();
            setPlayingVerseKey(null);
        } else {
            if (audioRef.current) {
                audioRef.current.src = fullUrl;
                audioRef.current.play();
                setPlayingVerseKey(verseKey);
            }
        }
    };

    // Navigation Handlers
    const nextPage = () => {
        if (currentPageIndex < pages.length - 1) {
            setDirection(-1); // Next page comes from Left (RTL)
            setCurrentPageIndex(prev => prev + 1);
            // Reset audio on page turn
            setPlayingVerseKey(null);
            audioRef.current?.pause();
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (juzId < 30) {
            // Next Juz
            router.push(`/quran/juz/${juzId + 1}`);
        }
    };

    const prevPage = () => {
        if (currentPageIndex > 0) {
            setDirection(1); // Prev page comes from Right (RTL)
            setCurrentPageIndex(prev => prev - 1);
            setPlayingVerseKey(null);
            audioRef.current?.pause();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (juzId > 1) {
            // Prev Juz
            router.push(`/quran/juz/${juzId - 1}`);
        }
    };

    const jumpToPage = (index: number) => {
        setDirection(index > currentPageIndex ? -1 : 1);
        setCurrentPageIndex(index);
        setShowPageMenu(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Animation Variants
    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Memuat Juz {juzId}...</p>
                </div>
            </div>
        );
    }

    if (error || pages.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
                <div className="text-center space-y-4 px-4">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                    <p className="text-gray-900 dark:text-white font-medium">{error || "Data kosong"}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold"
                    >
                        Coba Lagi
                    </button>
                    <Link href="/quran" className="block text-sm text-gray-500 hover:underline">Kembali ke Daftar</Link>
                </div>
            </div>
        );
    }

    const activePage = pages[currentPageIndex];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-14">
            <audio
                ref={audioRef}
                onEnded={() => setPlayingVerseKey(null)}
            />

            {/* Header Sticky - Compact Version */}
            {/* Changed top-[50px] to top-0 to save space and stick to very top */}
            <div className="sticky top-0 z-[60] bg-white/90 dark:bg-black/90 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 shadow-sm transition-all">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/quran" className="p-2 -ml-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                        <ChevronLeft className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </Link>

                    <div className="text-center flex flex-col justify-center">
                        <h1 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">Juz {juzId}</h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold leading-tight">
                            Hal {currentPageIndex + 1} / {pages.length}
                        </p>
                    </div>

                    <button
                        onClick={() => setShowPageMenu(!showPageMenu)}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors relative"
                    >
                        <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                    </button>
                </div>
            </div>

            {/* Page Menu Dropdown (Simple implementation) */}
            {showPageMenu && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setShowPageMenu(false)}>
                    <div className="absolute top-28 right-4 w-64 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300" onClick={e => e.stopPropagation()}>
                        <div className="p-4 border-b border-gray-100 dark:border-neutral-800">
                            <h3 className="font-bold text-gray-900 dark:text-white">Pilih Halaman</h3>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2 grid grid-cols-4 gap-2">
                            {pages.map((p, idx) => (
                                <button
                                    key={p.pageNumber}
                                    onClick={() => jumpToPage(idx)}
                                    className={`p-2 rounded-lg text-xs font-bold transition-all ${idx === currentPageIndex
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-gray-50 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-700'
                                        }`}
                                >
                                    {p.pageNumber}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content Area with Swipe */}
            {/* Reduced pt-20 to pt-4 because sticky header already takes layout space */}
            <div className="max-w-2xl mx-auto px-2 md:px-4 pt-4 pb-6 overflow-hidden relative min-h-[75vh]">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={currentPageIndex}
                        custom={direction}
                        variants={slideVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = offset.x; // + right, - left

                            // Inverted Swipe Logic for RTL:
                            if (swipe > 100) {
                                nextPage(); // Swipe Right -> Next (Enter from Left)
                            } else if (swipe < -100) {
                                prevPage(); // Swipe Left -> Prev (Enter from Right)
                            }
                        }}
                        className="bg-white dark:bg-[#070707] border border-gray-200 dark:border-neutral-800 shadow-xl rounded-[2.5rem] overflow-hidden"
                    >
                        {/* Page Header internal */}
                        <div className="bg-gray-50 dark:bg-neutral-900/50 border-b border-gray-100 dark:border-neutral-800 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                    Halaman {activePage.pageNumber}
                                </span>
                            </div>
                            <BookOpen className="w-4 h-4 text-emerald-500/50" />
                        </div>

                        <div className="p-4 md:p-8 space-y-10">
                            {activePage.verses.map((verse) => (
                                <div key={verse.verse_key} className="relative group">
                                    {/* Action Header */}
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30">
                                            {verse.verse_key}
                                        </div>
                                        <button
                                            onClick={() => handlePlayAudio(verse.audio?.url, verse.verse_key)}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${playingVerseKey === verse.verse_key
                                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                                : 'bg-gray-100 dark:bg-neutral-800 text-gray-400 hover:text-emerald-500 hover:scale-110'
                                                }`}
                                        >
                                            {playingVerseKey === verse.verse_key ? (
                                                <Pause className="w-3.5 h-3.5 fill-current" />
                                            ) : (
                                                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Arabic Text */}
                                    <div className="text-right mb-6" dir="rtl">
                                        <p className="font-arabic text-3xl md:text-4xl lg:text-5xl leading-[2.2] md:leading-[2.5] text-gray-900 dark:text-white">
                                            {verse.text_uthmani}
                                            <span className="inline-flex items-center justify-center w-8 h-8 md:w-10 md:h-10 border-2 border-emerald-500 rounded-full text-sm md:text-base font-bold text-emerald-600 dark:text-emerald-400 mx-2 align-middle relative -top-1">
                                                {verse.verse_number}
                                            </span>
                                        </p>
                                    </div>

                                    {/* Translation */}
                                    {verse.translations && verse.translations[0] && (
                                        <div className="relative pl-4 border-l-2 border-emerald-500/20 dark:border-emerald-500/10">
                                            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 leading-relaxed text-justify">
                                                {verse.translations[0].text.replace(/<[^>]*>/g, '')}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Footer decoration */}
                        <div className="h-2 bg-emerald-500/10 dark:bg-emerald-500/5"></div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Bottom Floating Navigation (Standard for Page turn) */}
            <div className="fixed bottom-4 inset-x-0 flex items-center justify-center gap-6 z-30 pointer-events-none">
                <button
                    onClick={prevPage}
                    disabled={currentPageIndex === 0 && juzId === 1}
                    className="pointer-events-auto w-14 h-14 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-xl shadow-black/10 flex items-center justify-center text-gray-700 dark:text-white hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                <div className="pointer-events-auto px-6 py-2 bg-black/80 dark:bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-widest shadow-xl">
                    Page {activePage ? activePage.pageNumber : '-'}
                </div>

                <button
                    onClick={nextPage}
                    disabled={currentPageIndex === pages.length - 1 && juzId === 30}
                    className="pointer-events-auto w-14 h-14 rounded-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-xl shadow-black/10 flex items-center justify-center text-gray-700 dark:text-white hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100"
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}
