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
        <div className="space-y-8">
            {/* Search and Filters */}
            <div className="space-y-4 max-w-5xl mx-auto">
                {/* Search Input */}
                <div className="relative group">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Cari doa berdasarkan nama, isi, atau kategori..."
                        className="w-full px-6 py-4 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-neutral-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-gray-800 dark:text-gray-100 placeholder-gray-500 shadow-sm"
                    />
                </div>

                {/* Dropdown Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="relative">
                        <select
                            value={selectedGrup}
                            onChange={(e) => setSelectedGrup(e.target.value)}
                            className="w-full appearance-none px-5 py-3.5 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-neutral-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm text-gray-700 dark:text-gray-300 cursor-pointer shadow-sm"
                        >
                            <option value="all">Semua Kategori</option>
                            {groups.map((grup) => (
                                <option key={grup} value={grup}>
                                    {grup}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="relative">
                        <select
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className="w-full appearance-none px-5 py-3.5 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-neutral-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 text-sm text-gray-700 dark:text-gray-300 cursor-pointer shadow-sm"
                        >
                            <option value="all">Semua Tag</option>
                            {tags.map((tag) => (
                                <option key={tag} value={tag}>
                                    {tag}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Results Count */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-500 font-medium">
                Menampilkan {filteredDoa.length} dari {doaList.length} doa
            </div>

            {/* Doa Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredDoa.map((doa) => (
                    <Link
                        key={doa.id}
                        href={`/doa/${doa.id}`}
                        className="group flex flex-col bg-white dark:bg-[#0a0a0a] rounded-[2rem] border border-gray-100 dark:border-neutral-800 overflow-hidden hover:border-emerald-500/50 transition-all duration-300 hover:-translate-y-1 shadow-sm"
                    >
                        {/* Card Header */}
                        <div className="p-8 pb-0 space-y-4">
                            <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-500 leading-tight">
                                {doa.nama}
                            </h3>

                            <div className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                                {doa.grup}
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-8 pt-6 flex-grow flex flex-col justify-between">
                            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed line-clamp-4 mb-6">
                                {doa.idn}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-2">
                                {doa.tag && doa.tag.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-gray-100 dark:bg-neutral-800/50 text-gray-600 dark:text-gray-400 rounded-full text-[10px] font-bold uppercase tracking-wider"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
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
