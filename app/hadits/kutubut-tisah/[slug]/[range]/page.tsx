"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

interface HadithSummary {
    number: number;
    arab: string;
    id: string;
}

interface HadithResponse {
    name: string;
    id: string;
    available: number;
    requested: number;
    hadiths: HadithSummary[];
}

export default function HadithRangePage() {
    const params = useParams();
    const router = useRouter();

    const slug = params.slug as string;
    const range = params.range as string; // e.g., "1-50"

    const [data, setData] = useState<HadithResponse | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHadiths = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`https://api.hadith.gading.dev/books/${slug}?range=${range}`);
                setData(res.data.data);
            } catch (error) {
                console.error("Gagal mengambil daftar hadits", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug && range) fetchHadiths();
    }, [slug, range]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Memuat Hadits...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black pt-16 pb-20">
            {/* Header Sticky */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href={`/hadits/kutubut-tisah/${slug}`}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors font-medium group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Kembali</span>
                    </Link>

                    <div className="text-center">
                        <h1 className="font-bold text-gray-900 dark:text-white">
                            {data.name}
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Hadits {range}
                        </p>
                    </div>

                    <div className="w-20"></div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* List */}
                <div className="grid grid-cols-1 gap-4">
                    {data.hadiths.map((h) => (
                        <Link
                            key={h.number}
                            href={`/hadits/kutubut-tisah/${slug}/${range}/${h.number}`}
                            className="group bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:border-blue-500/30 hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-100 dark:border-blue-800 group-hover:scale-110 transition-transform">
                                    {h.number}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="font-arabic text-right text-gray-800 dark:text-gray-200 text-lg md:text-xl leading-loose mb-3 line-clamp-2" dir="rtl">
                                        {h.arab}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                                        {h.id}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
