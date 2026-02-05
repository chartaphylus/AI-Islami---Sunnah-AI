"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Article {
    id: string;
    title: string;
    link: string;
    pubDate: string;
    isoDate: string;
    source: string;
    contentSnippet: string;
    color: string;
    bg: string;
}

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchArticles = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/articles");
            if (!res.ok) throw new Error("Gagal mengambil artikel");
            const data = await res.json();
            if (data.success) {
                setArticles(data.articles);
            } else {
                throw new Error(data.error || "Gagal memuat artikel");
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, []);

    const formatDate = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleDateString("id-ID", {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black pb-10 font-sans selection:bg-emerald-100 selection:text-emerald-900">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-white/5 shadow-sm">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors font-medium group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="hidden sm:inline">Kembali</span>
                    </Link>

                    <div className="text-center">
                        <h1 className="font-bold text-gray-900 dark:text-white text-lg">Artikel Islami</h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Bacaan Bermanfaat Harian
                        </p>
                    </div>

                    <div className="w-5"></div> {/* Spacer to center title */}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-3xl mx-auto px-4 py-6">

                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Mengambil artikel terbaru...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-20 px-4">
                        <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-xl mb-4 text-sm inline-block">
                            {error}
                        </div>
                        <br />
                        <button
                            onClick={fetchArticles}
                            className="text-emerald-600 dark:text-emerald-400 text-sm font-medium hover:underline"
                        >
                            Coba Lagi
                        </button>
                    </div>
                )}

                {!loading && !error && (
                    <div className="space-y-4">
                        {articles.map((article, index) => (
                            <motion.article
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-white dark:bg-neutral-900 rounded-2xl p-5 border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center gap-2 mb-3">
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${article.bg} ${article.color}`}>
                                        {article.source}
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(article.isoDate)}
                                    </span>
                                </div>

                                <h2 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-2 leading-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                    <Link href={`/articles/${article.id}`}>
                                        {article.title}
                                    </Link>
                                </h2>

                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
                                    {article.contentSnippet}
                                </p>

                                <Link
                                    href={`/articles/${article.id}`}
                                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
                                >
                                    Baca Selengkapnya
                                    <ExternalLink className="w-3 h-3" />
                                </Link>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
