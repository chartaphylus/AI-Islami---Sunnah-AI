"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { getChapters } from '../actions';

interface HadithBook {
    name: string;
    id: string; // slug
    count: number;
    chapters: {
        id: number;
        title: string;
        number: number;
    }[];
}

export default function BookChaptersPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();

    const [book, setBook] = useState<HadithBook | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBook = async () => {
            try {
                // 1. Fetch Book info
                const { data, error } = await supabase
                    .from('hadith_books')
                    .select('name_en, slug, id')
                    .eq('slug', slug)
                    .single();

                if (error || !data) throw new Error("Book not found");

                // 2. Fetch Chapters (using Server Action to bypass RLS)
                const chaptersData = await getChapters(data.id);

                const chapters = (chaptersData || []).map((c: any, index: number) => ({
                    id: c.id,
                    title: c.title_ar || c.title_en || `Bab ${c.chapter_number}`,
                    number: index + 1 // Force sequential 1-based numbering for display
                }));

                // 3. Fetch total hadith count for the book
                const { count, error: countError } = await supabase
                    .from('hadiths')
                    .select('*', { count: 'exact', head: true })
                    .eq('book_id', data.id);

                setBook({
                    name: data.name_en,
                    id: data.slug,
                    count: count || 0,
                    chapters: chapters
                });

            } catch (error) {
                console.error("Gagal mengambil info buku", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBook();
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

    if (!book) return null;

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black pt-16 pb-20">
            {/* Header Sticky */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href={slug === 'bukhari' || slug === 'muslim' || slug === 'nasai' || slug === 'abudawud' || slug === 'tirmidhi' || slug === 'ibnmajah' || slug === 'ahmed' || slug === 'darimi' || slug === 'malik' ? "/hadits/kutubut-tisah" : "/hadits"}
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors font-medium group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Kembali</span>
                    </Link>

                    <div className="text-center">
                        <h1 className="font-bold text-gray-900 dark:text-white">
                            {book.name}
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            {book.count.toLocaleString('id-ID')} Hadits
                        </p>
                    </div>

                    <div className="w-20"></div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {book.chapters.map((chapter: any) => (
                        <Link
                            key={chapter.id}
                            href={`/hadits/${slug}/bab/${chapter.id}`}
                            className="group bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-gray-100 dark:border-neutral-800 hover:border-blue-500/30 hover:shadow-lg dark:hover:shadow-blue-500/10 transition-all flex items-center justify-between"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-100 dark:border-blue-800 group-hover:scale-110 transition-transform">
                                    {chapter.number}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-arabic text-right text-gray-900 dark:text-white text-lg leading-relaxed line-clamp-2" dir="rtl">
                                        {chapter.title}
                                    </h3>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
                        </Link>
                    ))}
                </div>
            </main>
        </div>
    );
}
