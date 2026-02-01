"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Book, ChevronRight, Library, ArrowLeft, ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface HadithBook {
    name: string;
    id: string;
    available: number;
}

export default function ImamsPage() {
    const [books, setBooks] = useState<HadithBook[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const res = await axios.get('https://api.hadith.gading.dev/books');
                if (Array.isArray(res.data.data)) {
                    setBooks(res.data.data);
                } else if (Array.isArray(res.data)) {
                    setBooks(res.data);
                }
            } catch (error) {
                console.error("Gagal mengambil daftar kitab", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, []);

    const getBookColor = (id: string) => {
        const colors: { [key: string]: string } = {
            bukhari: "from-blue-500 to-indigo-500",
            muslim: "from-emerald-500 to-teal-500",
            nasai: "from-orange-500 to-amber-500",
            abudaud: "from-purple-500 to-pink-500",
            tirmidzi: "from-red-500 to-rose-500",
            ibnumajah: "from-cyan-500 to-sky-500",
            ahmad: "from-lime-500 to-green-500",
            darimi: "from-violet-500 to-purple-500",
            malik: "from-yellow-500 to-amber-500",
        };
        return colors[id] || "from-gray-500 to-slate-500";
    };

    const getFullBookName = (id: string) => {
        const names: { [key: string]: string } = {
            bukhari: "Shahih al-Bukhari",
            muslim: "Shahih Muslim",
            nasai: "Sunan an-Nasa’i",
            "abu-daud": "Sunan Abi Dawud",
            tirmidzi: "Sunan at-Tirmidzi",
            "ibnu-majah": "Sunan Ibnu Majah",
            ahmad: "Musnad Ahmad bin Hanbal",
            darimi: "Sunan ad-Darimi",
            malik: "Al-Muwaththa’ Imam Malik",
        };
        return names[id] || "";
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black pt-16">
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
                        <h1 className="font-bold text-gray-900 dark:text-white">
                            Kutubut Tis'ah
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Pilih Kitab / Perawi
                        </p>
                    </div>

                    <div className="w-20"></div>
                </div>
            </div>

            {/* Books Grid */}
            <div className="max-w-7xl mx-auto px-4 py-8 pb-20">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {[...Array(9)].map((_, i) => (
                            <div key={i} className="h-32 bg-white dark:bg-neutral-900/50 rounded-2xl border border-gray-200 dark:border-neutral-800 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                        {books.map((book) => (
                            <Link
                                key={book.id}
                                href={`/hadits/kutubut-tisah/${book.id}`}
                                className="group relative bg-white dark:bg-neutral-900 rounded-2xl md:rounded-[2rem] p-4 border border-gray-200 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                            >
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${getBookColor(book.id)} opacity-10 rounded-bl-[3rem] group-hover:scale-110 transition-transform duration-500`}></div>

                                <div className="relative z-10 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className={`shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${getBookColor(book.id)} flex items-center justify-center text-white shadow-md group-hover:shadow-lg transition-shadow`}>
                                            <Book className="w-5 h-5 md:w-6 md:h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-sm md:text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight mb-1">
                                                {getFullBookName(book.id)}
                                            </h3>
                                            <div className="flex items-center gap-1.5 md:gap-2">
                                                <p className="text-[10px] md:text-xs text-gray-400 dark:text-gray-500 font-medium">
                                                    {book.name}
                                                </p>
                                                <span className="w-1 h-1 rounded-full bg-gray-200 dark:bg-neutral-800 shrink-0"></span>
                                                <p className="text-[10px] md:text-xs text-blue-500 dark:text-blue-400 font-bold">
                                                    {book.available.toLocaleString('id-ID')} Hadits
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-gray-50 dark:bg-neutral-800 flex items-center justify-center text-gray-400 group-hover:bg-blue-500 group-hover:text-white transition-all shrink-0">
                                        <ChevronRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
