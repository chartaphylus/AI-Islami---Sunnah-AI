"use client";

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, Search, Sparkles, Heart, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Doa } from '@/lib/types';

export default function DoaPage() {
    const [doaList, setDoaList] = useState<Doa[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedGrup, setSelectedGrup] = useState<string>("all");
    const [selectedTag, setSelectedTag] = useState<string>("all");

    useEffect(() => {
        const fetchDoa = async () => {
            try {
                const { data, error } = await supabase
                    .from('doa')
                    .select('*')
                    .order('id');

                if (error) throw error;

                // Map database columns to application interface
                const mappedData: Doa[] = (data || []).map((item: any) => ({
                    id: item.id,
                    nama: item.nama,
                    grup: item.category || item.grup || 'Umum', // Handle both namings
                    tag: item.tags || item.tag || [],
                    ar: item.arabic,
                    tr: item.latin,
                    idn: item.translation,
                    tentang: item.notes
                }));

                setDoaList(mappedData);
            } catch (error) {
                console.error("Gagal mengambil data doa", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoa();
    }, []);

    // Extract unique groups and tags
    const { groups, tags } = useMemo(() => {
        const uniqueGroups = [...new Set(doaList.map((d) => d.grup).filter(Boolean))].sort();
        const uniqueTags = [...new Set(doaList.flatMap((d) => d.tag || []))].sort();
        return { groups: uniqueGroups, tags: uniqueTags };
    }, [doaList]);

    // Filter Logic
    const filteredDoa = useMemo(() => {
        return doaList.filter((doa) => {
            const matchesSearch =
                search === "" ||
                doa.nama.toLowerCase().includes(search.toLowerCase());

            const matchesGrup = selectedGrup === "all" || doa.grup === selectedGrup;
            const matchesTag = selectedTag === "all" || (doa.tag && doa.tag.includes(selectedTag));

            return matchesSearch && matchesGrup && matchesTag;
        });
    }, [doaList, search, selectedGrup, selectedTag]);

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black pt-16 pb-20">
            {/* Header Sticky - Added for consistency */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="w-10"></div>

                    <div className="text-center">
                        <h1 className="font-bold text-gray-900 dark:text-white">
                            Kumpulan Doa
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Doa Harian
                        </p>
                    </div>

                    <div className="w-10"></div>
                </div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden pt-6 pb-8 md:pt-8 md:pb-12">
                <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none"></div>

                <div className="relative max-w-5xl mx-auto px-4 text-center space-y-3 md:space-y-6">

                    {/* Description */}
                    <p className="text-xs md:text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto leading-relaxed px-4">
                        Kumpulan doa harian yang dapat membantu Anda dalam beribadah dan mendekatkan diri kepada Allah
                    </p>

                    {/* Compact Search & Filters */}
                    <div className="max-w-2xl mx-auto space-y-2">
                        {/* Search Bar */}
                        <div className="relative w-full group">
                            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-violet-500 transition-colors">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                placeholder="Cari doa..."
                                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 shadow-sm"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Filters Row */}
                        <div className="flex gap-2">
                            {/* Group Filter */}
                            <div className="relative flex-1">
                                <select
                                    value={selectedGrup}
                                    onChange={(e) => setSelectedGrup(e.target.value)}
                                    className="w-full appearance-none pl-3 pr-8 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 focus:outline-none focus:border-violet-500 cursor-pointer"
                                >
                                    <option value="all">Semua Kategori</option>
                                    {groups.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                            </div>

                            {/* Tag Filter */}
                            <div className="relative flex-1">
                                <select
                                    value={selectedTag}
                                    onChange={(e) => setSelectedTag(e.target.value)}
                                    className="w-full appearance-none pl-3 pr-8 py-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 focus:outline-none focus:border-violet-500 cursor-pointer"
                                >
                                    <option value="all">Semua Tag</option>
                                    {tags.map(t => <option key={t} value={t}>#{t}</option>)}
                                </select>
                                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content List */}
            <div className="max-w-7xl mx-auto px-4 pb-20">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="h-40 bg-white dark:bg-neutral-900/50 rounded-[2rem] border border-gray-200 dark:border-neutral-800 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {filteredDoa.length > 0 ? (
                            filteredDoa.map((doa) => (
                                <div
                                    key={doa.id}
                                    className="group bg-white dark:bg-neutral-900 border border-gray-200/60 dark:border-neutral-800 rounded-[2rem] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-violet-500/10 hover:border-violet-500/30 flex flex-col relative overflow-hidden active:scale-[0.98] active:border-violet-500"
                                >
                                    {/* Top Section: Info - Clickable Link */}
                                    <Link
                                        href={`/doa/${doa.id}`}
                                        className="p-4 flex items-center gap-3 relative z-0 flex-grow hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors"
                                    >
                                        {/* Icon Badge */}
                                        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border-2 border-dashed border-gray-200 dark:border-neutral-700 group-hover:border-violet-500 group-hover:rotate-45 transition-all duration-500">
                                            <Sparkles className="w-4 h-4 text-gray-500 dark:text-gray-400 -rotate-45 group-hover:rotate-0 transition-transform duration-500 group-hover:text-violet-500" />
                                        </div>

                                        {/* Text Content */}
                                        <div className="flex-grow min-w-0">
                                            <div className="flex items-center justify-between gap-2">
                                                <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate group-hover:text-violet-500 transition-colors">
                                                    {doa.nama}
                                                </h3>
                                            </div>

                                            {/* Tags as Replacement for Verse Count */}
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 font-medium mt-0.5">
                                                {doa.tag && doa.tag.length > 0 ? (
                                                    doa.tag.map(t => `#${t}`).join(' ')
                                                ) : (
                                                    "Doa Harian"
                                                )}
                                            </p>
                                        </div>
                                    </Link>

                                    {/* Action Button - Footer */}
                                    <Link
                                        href={`/doa/${doa.id}`}
                                        className="relative z-10 w-full py-2.5 bg-violet-50 dark:bg-violet-900/20 border-t border-violet-100 dark:border-neutral-800 text-center text-violet-600 dark:text-violet-400 text-[10px] font-bold uppercase tracking-widest hover:bg-violet-500 hover:text-white transition-all flex items-center justify-center gap-2 mt-auto"
                                    >
                                        <span>✨ Baca Doa</span>
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20">
                                <p className="text-gray-400 font-medium">Doa tidak ditemukan.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
