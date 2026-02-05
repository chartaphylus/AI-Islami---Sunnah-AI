"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getChapterDetail } from '../../../actions';

interface HadithSummary {
    uuid: string;
    number: number;
    arab: string;
    text: string;
}

interface ChapterData {
    bookName: string;
    slug: string;
    chapterTitle: string;
    chapterNumber: number;
    hadiths: HadithSummary[];
}

export default function ChapterListPage({ params }: { params: Promise<{ slug: string; chapterId: string }> }) {
    const { slug, chapterId } = use(params);
    const router = useRouter();

    const [data, setData] = useState<ChapterData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChapter = async () => {
            if (!slug || !chapterId) return;
            setLoading(true);
            try {
                // 1. Fetch Book info
                const { data: bookData, error: bookError } = await supabase
                    .from('hadith_books')
                    .select('id, name_en, slug')
                    .eq('slug', slug)
                    .single();

                if (bookError || !bookData) throw new Error("Book not found");

                // 2. Fetch Chapter info (using Server Action to bypass RLS)
                const chapterData = await getChapterDetail(chapterId);

                if (!chapterData) throw new Error("Chapter not found");

                // 3. Fetch Hadiths by chapter_id
                const { data: hadithsData, error: hadithsError } = await supabase
                    .from('hadiths')
                    .select('id, hadith_number, text_ar') // text_en removed to save bandwidth
                    .eq('book_id', bookData.id)
                    .eq('chapter_id', chapterId)
                    .order('hadith_number', { ascending: true });

                if (hadithsError) throw hadithsError;

                const mappedHadiths = (hadithsData || []).map((h: any) => ({
                    uuid: h.id,
                    number: h.hadith_number,
                    arab: h.text_ar,
                    text: h.text_en
                }));

                setData({
                    bookName: bookData.name_en,
                    slug: bookData.slug,
                    chapterTitle: chapterData.title_ar || chapterData.title_en || `Bab ${chapterData.chapter_number}`,
                    chapterNumber: chapterData.chapter_number,
                    hadiths: mappedHadiths
                });

            } catch (error) {
                console.error("Gagal mengambil data bab", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChapter();
    }, [slug, chapterId]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-white dark:bg-black">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
                    <p className="text-gray-400 font-medium animate-pulse">Memuat Bab...</p>
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
                        href={`/hadits/${slug}`}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors font-medium group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Kembali ke Daftar Bab</span>
                    </Link>

                    <div className="text-center">
                        <h1 className="font-bold text-gray-900 dark:text-white">
                            {data.bookName}
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Bab {data.chapterNumber}
                        </p>
                    </div>

                    <div className="w-20"></div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-8 text-center px-4">
                    <h2 className="font-arabic text-2xl md:text-4xl text-gray-900 dark:text-white leading-[2.2] md:leading-loose" dir="rtl">
                        {data.chapterTitle}
                    </h2>
                </div>

                {/* List */}
                <div className="grid grid-cols-1 gap-4">
                    {data.hadiths.map((h) => (
                        <Link
                            key={h.uuid}
                            href={`/hadits/${slug}/${h.number}`}
                            className="group bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:border-blue-500/30 hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-100 dark:border-blue-800 group-hover:scale-110 transition-transform">
                                    {h.number}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <p className="font-arabic text-right text-gray-800 dark:text-gray-200 text-lg md:text-xl leading-[2.2] md:leading-loose mb-1 line-clamp-1" dir="rtl">
                                        {h.arab}
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
