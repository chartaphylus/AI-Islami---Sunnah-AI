"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, ChevronLeft, Copy, Share2, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';

interface HadithDetail {
    number: number;
    arab: string;
    id: string; // content translation
}

interface HadithResponse {
    name: string;
    id: string; // slug
    contents: HadithDetail;
}

export default function HadithDetailPage() {
    const params = useParams();
    const router = useRouter();

    const slug = params.slug as string;
    const number = Number(params.number);

    const [data, setData] = useState<HadithResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    // Direction tracking for animation
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        // ... existing fetch logic ...
        const fetchHadith = async () => {
            // ... existing implementation ...
            if (!slug || !number) return;
            setLoading(true);
            try {
                // ... same fetch logic ...
                // 1. Fetch Book info for name & ID
                const { data: bookData, error: bookError } = await supabase
                    .from('hadith_books')
                    .select('id, name_en, slug') // Use name_en
                    .eq('slug', slug)
                    .single();

                if (bookError) throw bookError;

                // 2. Fetch Hadith content using book_id
                const { data: hadithData, error: hadithError } = await supabase
                    .from('hadiths')
                    .select('hadith_number, text_ar, text_en')
                    .eq('book_id', bookData.id)
                    .eq('hadith_number', number)
                    .limit(1)
                    .single();

                if (hadithData) {
                    setData({
                        name: bookData.name_en,
                        id: bookData.slug,
                        contents: {
                            number: hadithData.hadith_number,
                            arab: hadithData.text_ar,
                            id: hadithData.text_en
                        }
                    });
                } else {
                    // Handle not found
                    console.error("Hadith not found", hadithError);
                }
            } catch (error) {
                console.error("Gagal mengambil detail hadits", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHadith();
    }, [slug, number]);

    // ... existing handlers ...
    const handleCopy = () => {
        if (!data) return;
        const textToCopy = `*Hadits ${data.name} No. ${data.contents.number}*\n\n${data.contents.arab}\n\n${data.contents.id}\n\n_Sumber: AI Islami_`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        if (!data) return;
        const textToShare = `*Hadits ${data.name} No. ${data.contents.number}*\n\n${data.contents.arab}\n\n${data.contents.id}\n\n_Sumber: AI Islami_`;
        const url = `https://wa.me/?text=${encodeURIComponent(textToShare)}`;
        window.open(url, '_blank');
    };

    const onDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const threshold = 50;
        const velocity = 0.5;

        // Swipe Left -> Next
        if (info.offset.x < -threshold && info.velocity.x < -velocity) {
            setDirection(1);
            router.push(`/hadits/${slug}/${number + 1}`);
        }
        // Swipe Right -> Prev
        else if (info.offset.x > threshold && info.velocity.x > velocity) {
            if (number > 1) {
                setDirection(-1);
                router.push(`/hadits/${slug}/${number - 1}`);
            }
        }
    };

    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    if (loading) {
        // ... existing loading ...
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Membuka Hadits...</p>
                </div>
            </div>
        );
    }

    if (!data) return (
        // ... existing not found ...
        <div className="min-h-screen flex items-center justify-center text-gray-500">
            Data tidak ditemukan.
        </div>
    );

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] pt-16 pb-20 overflow-x-hidden">
            {/* Header Sticky */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    {/* ... existing header content ... */}
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-emerald-500 transition-colors font-medium group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Kembali</span>
                    </button>

                    <div className="text-center">
                        <h1 className="font-bold text-gray-900 dark:text-white">
                            {data.name}
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Hadits No. {data.contents.number}
                        </p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleCopy}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-gray-400"
                            title="Salin Hadits"
                        >
                            {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-gray-400"
                            title="Bagikan ke WhatsApp"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <AnimatePresence initial={false} custom={direction} mode="wait">
                    <motion.div
                        key={number}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={0.2}
                        onDragEnd={onDragEnd}
                        className="touch-pan-y" // Allow vertical scrolling while dragging horizontally
                    >
                        <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 md:p-12 border border-gray-100 dark:border-neutral-800 shadow-xl shadow-black/[0.02] space-y-8 select-none cursor-grab active:cursor-grabbing">
                            {/* Arabic Text */}
                            <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-3xl p-6 md:p-8 mb-8 border border-gray-100 dark:border-neutral-800/50">
                                <p className="font-arabic text-2xl md:text-3xl lg:text-4xl text-gray-800 dark:text-gray-100 text-right leading-[2.2] md:leading-[2.6]" dir="rtl">
                                    {data.contents.arab}
                                </p>
                            </div>

                            {/* Translation */}
                            <div className="prose prose-lg prose-emerald dark:prose-invert max-w-none">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <span className="w-8 h-1 bg-emerald-500 rounded-full"></span>
                                    Terjemahan
                                </h3>
                                <p className="text-justify leading-loose text-gray-600 dark:text-gray-300">
                                    {data.contents.id}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons (kept as alternative) */}
                <div className="mt-12 flex justify-between items-center gap-4">
                    {/* ... existing buttons ... */}
                    {number > 1 ? (
                        <Link
                            href={`/hadits/${slug}/${number - 1}`}
                            onClick={() => setDirection(-1)}
                            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all group active:scale-95"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                            <div className="text-left">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Sebelumnya</p>
                                <p className="font-bold text-sm text-gray-900 dark:text-white">Hp. {number - 1}</p>
                            </div>
                        </Link>
                    ) : <div></div>}

                    <Link
                        href={`/hadits/${slug}/${number + 1}`}
                        onClick={() => setDirection(1)}
                        className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all group text-right active:scale-95"
                    >
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Selanjutnya</p>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">Hp. {number + 1}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
