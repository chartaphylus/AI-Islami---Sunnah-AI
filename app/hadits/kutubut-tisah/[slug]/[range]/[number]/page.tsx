"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronLeft, Copy, Share2, Check } from 'lucide-react';

interface HadithDetail {
    number: number;
    arab: string;
    id: string;
}

interface HadithResponse {
    name: string;
    id: string;
    available: number;
    contents: HadithDetail;
}

export default function HadithDetailPage() {
    const params = useParams();
    const router = useRouter();

    const slug = params.slug as string;
    const range = params.range as string;
    const number = Number(params.number);

    const [data, setData] = useState<HadithResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchHadith = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`https://api.hadith.gading.dev/books/${slug}/${number}`);
                setData(res.data.data);
            } catch (error) {
                console.error("Gagal mengambil detail hadits", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug && number) fetchHadith();
    }, [slug, number]);

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

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Membuka Hadits...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] pt-16 pb-20">
            {/* Header Sticky */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors font-medium group"
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
                <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 md:p-12 border border-gray-100 dark:border-neutral-800 shadow-xl shadow-black/[0.02] space-y-8">
                    {/* Arabic Text */}
                    <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-3xl p-8 mb-8 border border-gray-100 dark:border-neutral-800/50">
                        <p className="font-arabic text-2xl md:text-3xl lg:text-4xl text-gray-800 dark:text-gray-100 text-right leading-[2.4]" dir="rtl">
                            {data.contents.arab}
                        </p>
                    </div>

                    {/* Translation */}
                    <div className="prose prose-lg prose-blue dark:prose-invert max-w-none">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                            <span className="w-8 h-1 bg-blue-500 rounded-full"></span>
                            Terjemahan
                        </h3>
                        <p className="text-justify leading-loose text-gray-600 dark:text-gray-300">
                            {data.contents.id}
                        </p>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-12 flex justify-between items-center gap-4">
                    {number > 1 ? (
                        <Link
                            href={`/hadits/kutubut-tisah/${slug}/${range}/${number - 1}`}
                            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all group"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            <div className="text-left">
                                <p className="font-bold text-sm text-gray-900 dark:text-white">Hadits {number - 1}</p>
                            </div>
                        </Link>
                    ) : <div></div>}

                    <Link
                        href={`/hadits/kutubut-tisah/${slug}/${range}/${number + 1}`}
                        className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all group text-right"
                    >
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-gray-400 uppercase">Selanjutnya</p>
                            <p className="font-bold text-sm text-gray-900 dark:text-white">Hadits {number + 1}</p>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </Link>
                </div>
            </main>
        </div>
    );
}
