"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronDown } from "lucide-react";
import type { Doa } from "@/lib/types";

interface DoaListProps {
    doaList: Doa[];
}

export default function DoaList({ doaList }: DoaListProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGrup, setSelectedGrup] = useState<string>("all");
    const [selectedTag, setSelectedTag] = useState<string>("all");

    // Get unique groups
    const groups = useMemo(() => {
        const uniqueGroups = [...new Set(doaList.map((d) => d.grup))];
        return uniqueGroups.sort();
    }, [doaList]);

    // Get unique tags
    const tags = useMemo(() => {
        const allTags = doaList.flatMap((d) => d.tag || []);
        const uniqueTags = [...new Set(allTags)];
        return uniqueTags.sort();
    }, [doaList]);

    // Filter doa based on search, group, and tag
    const filteredDoa = useMemo(() => {
        return doaList.filter((doa) => {
            const matchesSearch =
                searchQuery === "" ||
                doa.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doa.idn.toLowerCase().includes(searchQuery.toLowerCase()) ||
                doa.grup.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesGrup = selectedGrup === "all" || doa.grup === selectedGrup;
            const matchesTag = selectedTag === "all" || (doa.tag && doa.tag.includes(selectedTag));

            return matchesSearch && matchesGrup && matchesTag;
        });
    }, [doaList, searchQuery, selectedGrup, selectedTag]);

    return (
        <div className="space-y-6">
            {/* Search & Filters */}
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col gap-3">
                    {/* Search Input (Matches Al-Quran Style) */}
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-emerald-500 transition-colors">
                            <Search className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari doa harian..."
                            className="w-full pl-11 pr-4 py-3 md:py-4 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm md:text-base text-gray-800 dark:text-gray-200 placeholder-gray-500 shadow-sm"
                        />
                    </div>

                    {/* Filters */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="relative">
                            <select
                                value={selectedGrup}
                                onChange={(e) => setSelectedGrup(e.target.value)}
                                className="w-full appearance-none pl-4 pr-10 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[10px] md:text-xs font-bold text-gray-600 dark:text-gray-300 cursor-pointer shadow-sm truncate"
                            >
                                <option value="all">Kategori</option>
                                {groups.map((grup) => (
                                    <option key={grup} value={grup}>
                                        {grup}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <select
                                value={selectedTag}
                                onChange={(e) => setSelectedTag(e.target.value)}
                                className="w-full appearance-none pl-4 pr-10 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl md:rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/10 text-[10px] md:text-xs font-bold text-gray-600 dark:text-gray-300 cursor-pointer shadow-sm truncate"
                            >
                                <option value="all">Semua Tag</option>
                                {tags.map((tag) => (
                                    <option key={tag} value={tag}>
                                        {tag}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Info Line */}
                <div className="mt-4 flex items-center justify-between text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest px-1">
                    <span>{filteredDoa.length} Doa ditemukan</span>
                </div>
            </div>

            {/* Doa Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredDoa.map((doa) => (
                    <Link
                        key={doa.id}
                        href={`/doa/${doa.id}`}
                        className="group relative flex flex-col justify-between bg-white dark:bg-[#0a0a0a] rounded-2xl border border-gray-200/60 dark:border-neutral-800 p-5 hover:border-emerald-500/30 hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    >
                        {/* Decorative Background Accent */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-50/50 to-transparent dark:from-emerald-900/10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110 duration-500" />

                        {/* Top Section */}
                        <div className="relative space-y-3 z-10">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1.5 flex-1">
                                    {/* Category Label */}
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                                            {doa.grup}
                                        </span>
                                    </div>
                                    {/* Title */}
                                    <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                        {doa.nama}
                                    </h3>
                                </div>
                                {/* Arrow Icon */}
                                <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-gray-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 shrink-0">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Section: Minimalist Tags */}
                        {doa.tag && doa.tag.length > 0 && (
                            <div className="relative mt-5 pt-4 border-t border-gray-100 dark:border-neutral-800/50 flex flex-wrap gap-2 z-10">
                                {doa.tag.slice(0, 3).map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-[10px] font-medium text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                                {doa.tag.length > 3 && (
                                    <span className="text-[10px] font-medium text-gray-400">+ {doa.tag.length - 3}</span>
                                )}
                            </div>
                        )}
                    </Link>
                ))}
            </div>

            {/* Empty State */}
            {filteredDoa.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-[3rem] border border-dashed border-gray-200 dark:border-neutral-800">
                    <div className="text-5xl mb-6">✨</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        Doa tidak ditemukan
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                        Coba gunakan kata kunci lain atau pilih kategori yang berbeda.
                    </p>
                </div>
            )}
        </div>
    );
}
