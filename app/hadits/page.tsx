"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Library, Search, ChevronLeft, Sparkles } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface HadithBook {
    name: string; // name_id
    nameAr: string; // name_ar
    id: string; // slug
    available: number;
}

const KUTUBUT_TISAH_SLUGS = [
    'bukhari', 'muslim', 'nasai', 'abudawud', 'tirmidhi',
    'ibnmajah', 'ahmed', 'darimi', 'malik'
];

export default function HadithLandingPage() {
    const [otherBooks, setOtherBooks] = useState<HadithBook[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchOtherBooks = async () => {
            try {
                // Fetch books with name_id, name_ar
                const { data, error } = await supabase
                    .from('hadith_books')
                    .select('*') // Get all to filter locally or you can filter in query
                    .order('id');

                if (error) throw error;

                // Filter out Kutubut Tisah from "Other Books" list
                const others = (data || []).filter((b: any) => !KUTUBUT_TISAH_SLUGS.includes(b.slug));

                // Fetch counts sequentially
                const othersWithCounts = [];
                for (const b of others) {
                    const { count, error: countError } = await supabase
                        .from('hadiths')
                        .select('*', { count: 'exact', head: true })
                        .eq('book_id', b.id);

                    if (countError) {
                        console.error(`Error counting hadiths for ${b.slug}`, JSON.stringify(countError));
                    }

                    othersWithCounts.push({
                        name: b.name_id || b.name_en, // Use name_id, fallback to en
                        nameAr: b.name_ar || '',
                        id: b.slug,
                        available: count || 0
                    });
                }

                setOtherBooks(othersWithCounts);
            } catch (error) {
                console.error("Gagal mengambil buku lain", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOtherBooks();
    }, []);

    const filteredBooks = otherBooks.filter(b =>
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.id.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black pt-16 pb-20">
            {/* Header Sticky - Added to match Mufrodat style */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="w-10"></div>

                    <div className="text-center">
                        <h1 className="font-bold text-gray-900 dark:text-white">
                            Kumpulan Hadits
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Ensiklopedia Hadits
                        </p>
                    </div>

                    <Link href="/hadits/game" className="p-2 rounded-xl bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors">
                        <Sparkles className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-6 pb-8 md:pt-8 md:pb-12">
                <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-blue-500/10 to-transparent pointer-events-none"></div>

                <div className="relative max-w-5xl mx-auto px-4 text-center space-y-3 md:space-y-6">
                    {/* Description */}
                    <p className="text-xs md:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed px-4">
                        Jelajahi ribuan hadits dari berbagai perawi terpercaya dan kitab-kitab pilihan.
                    </p>

                    {/* Integrated Search Bar */}
                    <div className="relative w-full max-w-xl mx-auto group px-2 pt-2 md:pt-4">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                            <Search className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <input
                            type="text"
                            placeholder="Cari kitab hadits..."
                            className="w-full pl-11 pr-4 py-3 md:py-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm md:text-base text-gray-800 dark:text-gray-200 placeholder-gray-500 shadow-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className="max-w-7xl mx-auto px-4 pb-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">

                    {/* Kutubut Tis'ah Card - Second Item */}
                    {/* Kutubut Tis'ah Card - Second Item */}
                    <div className="group bg-white dark:bg-neutral-900 border border-blue-200/60 dark:border-blue-900/30 rounded-[2rem] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-500/30 flex flex-col relative overflow-hidden active:scale-[0.98] active:border-blue-500">
                        <Link
                            href="/hadits/kutubut-tisah"
                            className="p-4 flex items-center gap-3 relative z-0 flex-grow hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors"
                        >
                            {/* Icon Badge */}
                            <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-500">
                                <BookOpen className="w-5 h-5" />
                            </div>

                            {/* Text Content */}
                            <div className="flex-grow min-w-0">
                                <div className="flex items-center justify-between gap-2">
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-blue-500 transition-colors">
                                        Kutubut Tis'ah
                                    </h3>
                                    <span className="font-arabic text-lg text-blue-600 dark:text-blue-500">
                                        الكتب التسعة
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 font-medium">
                                    9 Kitab Induk Hadits Utama
                                </p>
                            </div>
                        </Link>

                        {/* Action Button */}
                        <Link
                            href="/hadits/kutubut-tisah"
                            className="relative z-10 w-full py-2.5 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-100 dark:border-blue-800 text-center text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center gap-2 mt-auto"
                        >
                            <span>📚 Buka Koleksi</span>
                        </Link>
                    </div>

                    {/* Other Books List */}
                    {loading ? (
                        [...Array(6)].map((_, i) => (
                            <div key={i} className="h-40 bg-white dark:bg-neutral-900/50 rounded-[2rem] border border-gray-200 dark:border-neutral-800 animate-pulse"></div>
                        ))
                    ) : (
                        filteredBooks.map((book) => (
                            <div
                                key={book.id}
                                className="group bg-white dark:bg-neutral-900 border border-gray-200/60 dark:border-neutral-800 rounded-[2rem] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-500/30 flex flex-col relative overflow-hidden active:scale-[0.98] active:border-emerald-500"
                            >
                                {/* Top Section: Info - Clickable Link */}
                                <Link
                                    href={`/hadits/${book.id}`}
                                    className="p-4 flex items-center gap-3 relative z-0 flex-grow hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                                >
                                    {/* Icon Badge */}
                                    <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border-2 border-dashed border-gray-200 dark:border-neutral-700 group-hover:border-emerald-500 group-hover:rotate-45 transition-all duration-500">
                                        <Library className="w-4 h-4 text-gray-500 dark:text-gray-400 -rotate-45 group-hover:rotate-0 transition-transform duration-500 group-hover:text-emerald-500" />
                                    </div>

                                    {/* Text Content */}
                                    <div className="flex-grow min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-emerald-500 transition-colors">
                                                {book.name}
                                            </h3>
                                            {book.nameAr && (
                                                <span className="font-arabic text-lg text-emerald-600 dark:text-emerald-500">
                                                    {book.nameAr}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 font-medium">
                                            {book.available.toLocaleString('id-ID')} Hadits
                                        </p>
                                    </div>
                                </Link>

                                {/* Action Button */}
                                <Link
                                    href={`/hadits/${book.id}`}
                                    className="relative z-10 w-full py-2.5 bg-emerald-50 dark:bg-emerald-900/20 border-t border-emerald-100 dark:border-neutral-800 text-center text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2 mt-auto"
                                >
                                    <span>✨ Mulai Membaca</span>
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
