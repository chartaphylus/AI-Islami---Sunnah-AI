"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface HadithArbain {
    number: number;
    title: string; // usually not in hadiths table, maybe generic "Hadits {number}" or from content if structured
    id: string; // content translation
}

export default function ArbainListPage() {
    const [hadiths, setHadiths] = useState<HadithArbain[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArbain = async () => {
            try {
                // 1. Get book ID for 'nawawi40' (Standard slug for Arbain Nawawi in this DB)
                const { data: bookData, error: bookError } = await supabase
                    .from('hadith_books')
                    .select('id')
                    .eq('slug', 'nawawi40')
                    .single();

                if (bookError) throw bookError;

                const { data, error } = await supabase
                    .from('hadiths')
                    .select('id, hadith_number, text_en') // Add id
                    .eq('book_id', bookData.id)
                    .order('hadith_number', { ascending: true });

                if (error) throw error;

                // Map results. Note: title might need to be generated if not in DB.
                // Standard arbain titles are like "Amal Tergantung Niat", etc.
                // if 'content' text is long, we might truncate it for preview?
                // Or maybe title is stored? The schema for hadiths was 'number', 'arab', 'content' (translation).
                // I will use "Hadits Ke-{number}" as title if specific title isn't available, or check if 'content' has title.
                // But for now simplest                // Map results
                const mapped = (data || []).map((h: any) => ({
                    uuid: h.id,
                    number: h.hadith_number,
                    title: `Hadits Ke-${h.hadith_number}`,
                    id: h.text_en || "" // Handle null
                }));

                setHadiths(mapped);
            } catch (error) {
                console.error("Gagal mengambil data Arbain", error);
            } finally {
                setLoading(false);
            }
        };

        fetchArbain();
    }, []);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black pt-16 pb-20">
            {/* Header Sticky */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/hadits"
                        className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors font-medium group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Kembali</span>
                    </Link>

                    <div className="text-center">
                        <h1 className="font-bold text-gray-900 dark:text-white text-lg">
                            Arba'in An-Nawawi
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Total {hadiths.length} Hadits
                        </p>
                    </div>

                    <div className="w-10 sm:w-20"></div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-6 md:py-8">
                {/* List */}
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-100 dark:bg-neutral-900 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                        {hadiths.map((hadith) => (
                            <Link
                                key={hadith.number}
                                href={`/hadits/arbain/${hadith.number}`}
                                className="group bg-white dark:bg-neutral-900 p-4 md:p-6 rounded-2xl md:rounded-3xl border border-gray-100 dark:border-neutral-800 hover:border-emerald-500/30 hover:shadow-lg dark:hover:shadow-emerald-500/10 transition-all flex items-start gap-4"
                            >
                                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl md:rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-sm border border-emerald-100 dark:border-emerald-800 group-hover:scale-110 transition-transform mt-1">
                                    {hadith.number}
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-base md:text-lg mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight">
                                        {hadith.title}
                                    </h3>
                                    <p className="text-xs md:text-sm text-gray-400 dark:text-gray-500 line-clamp-2 leading-relaxed">
                                        {hadith.id}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
