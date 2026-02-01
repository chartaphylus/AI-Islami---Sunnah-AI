"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, BookOpen, Layers } from 'lucide-react';

interface BookInfo {
    name: string;
    id: string;
    available: number;
}

export default function ChaptersPage() {
    const params = useParams();
    const slug = params.slug as string;

    // Use the same colors as previous page for consistency
    const getBookColor = (id: string) => {
        const colors: { [key: string]: string } = {
            bukhari: "from-blue-500 to-indigo-500",
            muslim: "from-emerald-500 to-teal-500",
            nasai: "from-orange-500 to-amber-500",
            abudaud: "from-purple-500 to-pink-500",
            tirmidzi: "from-red-500 to-rose-500",
            ibnumajah: "from-cyan-500 to-sky-500",
            ahmad: "from-lime-500 to-green-500",
            darimi: "from-violet-500 to-purple-500",
            malik: "from-yellow-500 to-amber-500",
        };
        return colors[id] || "from-gray-500 to-slate-500";
    };

    const [bookInfo, setBookInfo] = useState<BookInfo | null>(null);
    const [loading, setLoading] = useState(true);

    const ITEMS_PER_CHAPTER = 50; // Each "Bab" contains 50 hadiths for better navigation

    useEffect(() => {
        const fetchBookInfo = async () => {
            try {
                // Fetch just a small range to get the 'available' count metadata
                const res = await axios.get(`https://api.hadith.gading.dev/books/${slug}?range=1-1`);
                setBookInfo({
                    name: res.data.data.name,
                    id: res.data.data.id,
                    available: res.data.data.available
                });
            } catch (error) {
                console.error("Gagal mengambil info kitab", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) fetchBookInfo();
    }, [slug]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Memuat Daftar Bab...</p>
                </div>
            </div>
        );
    }

    if (!bookInfo) return null;

    // Generate ranges
    const totalChapters = Math.ceil(bookInfo.available / ITEMS_PER_CHAPTER);
    const chapters = Array.from({ length: totalChapters }, (_, i) => {
        const start = i * ITEMS_PER_CHAPTER + 1;
        const end = Math.min((i + 1) * ITEMS_PER_CHAPTER, bookInfo.available);
        return {
            id: i + 1,
            start,
            end,
            label: `Bab ${i + 1}`,
            description: `Hadits No. ${start} - ${end}`
        };
    });

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black pt-16">
            {/* Header Sticky */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/hadits/kutubut-tisah"
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors font-medium group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Kembali</span>
                    </Link>

                    <div className="text-center">
                        <h1 className="font-bold text-gray-900 dark:text-white">
                            {bookInfo.name}
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Total {bookInfo.available.toLocaleString('id-ID')} Hadits
                        </p>
                    </div>

                    <div className="w-20"></div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                    {chapters.map((chapter) => (
                        <Link
                            key={chapter.id}
                            href={`/hadits/kutubut-tisah/${slug}/${chapter.start}-${chapter.end}`}
                            className="group bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:border-blue-500/30 hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all flex items-center gap-4"
                        >
                            <div className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${getBookColor(slug)} opacity-90 flex items-center justify-center text-white text-sm font-bold shadow-sm group-hover:scale-110 transition-transform`}>
                                {chapter.id}
                            </div>

                            <div className="flex-grow min-w-0">
                                <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base md:text-lg">
                                    {chapter.label}
                                </h3>
                                <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium mt-0.5 truncate">
                                    {chapter.description}
                                </p>
                            </div>

                            <div className="text-gray-300 group-hover:text-blue-500 transition-colors shrink-0">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
