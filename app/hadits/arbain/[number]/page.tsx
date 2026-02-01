"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowRight, ChevronLeft, Copy, Share2, Check } from 'lucide-react';
import arbainData from '../../Arbain-an-nawawi/arbain.json';

export default function ArbainDetailPage() {
    const params = useParams();
    const router = useRouter();
    const number = Number(params.number);

    const [hadith, setHadith] = useState<typeof arbainData[0] | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const found = arbainData.find(h => h.no === number);
        if (found) {
            setHadith(found);
        }
    }, [number]);

    const handleCopy = () => {
        if (!hadith) return;
        const textToCopy = `*${hadith.title}*\n\n${hadith.ar}\n\n${hadith.id}\n\n_Sumber: Arba'in An-Nawawi (AI Islami)_`;
        navigator.clipboard.writeText(textToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleShare = () => {
        if (!hadith) return;
        const textToShare = `*${hadith.title}*\n\n${hadith.ar}\n\n${hadith.id}\n\n_Sumber: Arba'in An-Nawawi (AI Islami)_`;
        const url = `https://wa.me/?text=${encodeURIComponent(textToShare)}`;
        window.open(url, '_blank');
    };

    if (!hadith) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
                <div className="flex flex-col items-center gap-4">
                    <p className="text-gray-400 font-medium">Hadits tidak ditemukan</p>
                    <Link href="/hadits/arbain" className="text-blue-500 hover:underline">Kembali ke Daftar</Link>
                </div>
            </div>
        );
    }

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

                    <div className="text-center flex-1 mx-2">
                        <h1 className="font-bold text-gray-900 dark:text-white text-sm md:text-base line-clamp-1">
                            {hadith.title}
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Hadits No. {hadith.no}
                        </p>
                    </div>

                    <div className="flex gap-1">
                        <button
                            onClick={handleCopy}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-gray-400"
                            title="Salin Hadits"
                        >
                            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={handleShare}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-gray-400"
                            title="Bagikan ke WhatsApp"
                        >
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
                <div className="bg-white dark:bg-neutral-900 rounded-3xl md:rounded-[2.5rem] p-6 md:p-12 border border-gray-100 dark:border-neutral-800 shadow-xl shadow-black/[0.02] space-y-6 md:space-y-8">
                    {/* Arabic Text */}
                    <div className="bg-gray-50 dark:bg-neutral-900/50 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-neutral-800/50">
                        <p className="font-arabic text-2xl md:text-3xl lg:text-4xl text-gray-800 dark:text-gray-100 text-right leading-[2.2] md:leading-[2.4]" dir="rtl">
                            {hadith.ar}
                        </p>
                    </div>

                    {/* Translation */}
                    <div className="prose prose-base md:prose-lg prose-emerald dark:prose-invert max-w-none">
                        <h3 className="text-xs md:text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3 md:mb-4 flex items-center gap-2">
                            <span className="w-6 h-1 bg-emerald-500 rounded-full"></span>
                            Terjemahan
                        </h3>
                        <p className="text-justify leading-loose text-gray-600 dark:text-gray-300 whitespace-pre-line text-sm md:text-base">
                            {hadith.id}
                        </p>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <div className="mt-8 md:mt-12 flex justify-between items-center gap-3">
                    {number > 1 ? (
                        <Link
                            href={`/hadits/arbain/${number - 1}`}
                            className="flex-1 flex items-center gap-2 md:gap-3 px-4 py-3 rounded-xl md:rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all group justify-center md:justify-start"
                        >
                            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                            <div className="text-left hidden md:block">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Sebelumnya</p>
                                <p className="font-bold text-sm text-gray-900 dark:text-white">Hadits {number - 1}</p>
                            </div>
                            <span className="md:hidden font-bold text-sm text-gray-600 dark:text-gray-400">Sebelumnya</span>
                        </Link>
                    ) : <div className="flex-1"></div>}

                    {number < 42 ? (
                        <Link
                            href={`/hadits/arbain/${number + 1}`}
                            className="flex-1 flex items-center gap-2 md:gap-3 px-4 py-3 rounded-xl md:rounded-2xl bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all group justify-center md:justify-end text-right"
                        >
                            <span className="md:hidden font-bold text-sm text-gray-600 dark:text-gray-400">Selanjutnya</span>
                            <div className="text-right hidden md:block">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Selanjutnya</p>
                                <p className="font-bold text-sm text-gray-900 dark:text-white">Hadits {number + 1}</p>
                            </div>
                            <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        </Link>
                    ) : <div className="flex-1"></div>}
                </div>
            </main>
        </div>
    );
}
