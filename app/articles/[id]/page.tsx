"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Calendar, Loader2, Share2, Globe, Info } from "lucide-react";

interface Article {
    id: string;
    title: string;
    link: string;
    pubDate: string;
    isoDate: string;
    source: string;
    contentSnippet: string;
    content?: string;
    color: string;
    bg: string;
}

export default function ArticleDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            setLoading(true);
            try {
                // Since we don't have a specific ID endpoint, we fetch all and filter
                // In a real app with DB, we would fetch /api/articles/${params.id}
                const res = await fetch("/api/articles");
                if (!res.ok) throw new Error("Gagal mengambil artikel");

                const data = await res.json();
                if (data.success) {
                    const found = data.articles.find((a: Article) => a.id === params.id);
                    if (found) {
                        setArticle(found);

                        // Check if content is short (likely summary only), then fetch full content
                        const currentContent = found.content || found.contentSnippet || "";
                        if (currentContent.length < 500 && found.link) {
                            fetchFullContent(found.link);
                        }
                    } else {
                        setError("Artikel tidak ditemukan");
                    }
                } else {
                    throw new Error(data.error || "Gagal memuat artikel");
                }
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchFullContent = async (url: string) => {
            try {
                const res = await fetch('/api/articles/content', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url })
                });
                const data = await res.json();
                if (data.success && data.content) {
                    setArticle(prev => prev ? { ...prev, content: data.content } : null);
                }
            } catch (e) {
                console.error("Failed to fetch full content", e);
            }
        };

        if (params.id) {
            fetchArticle();
        }
    }, [params.id]);

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

    const getPreviewContent = (article: Article) => {
        // Use content if available, otherwise snippet
        const text = article.content || article.contentSnippet || "";

        let stripped = text;

        // If it looks like HTML, strip it
        if (text.includes('<')) {
            const withBreaks = text.replace(/<\/p>/gi, '\n\n').replace(/<br\s*\/?>/gi, '\n');
            stripped = withBreaks.replace(/<[^>]*>?/gm, '');
        }

        // Clean up excessive whitespace
        const cleanText = stripped.replace(/\n\s*\n/g, '\n\n').trim();

        // Get rough length
        const totalLength = cleanText.length;

        // Take ~50-60%, but ensure it's substantial (aim for ~3-4 paragraphs worth)
        // Avg paragraph ~300-500 chars. 4 paragraphs ~1500-2000 chars.
        // If fetched content is short (e.g. 500 chars), take it all.
        const previewLength = Math.max(1000, Math.min(Math.floor(totalLength * 0.8), 3500));

        const preview = cleanText.substring(0, previewLength).trim();
        return preview + (preview.length < totalLength ? '...' : '');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black">
                <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-sm">Memuat artikel...</p>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-black p-4 text-center">
                <div className="bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-xl mb-6 max-w-md">
                    <p className="font-bold mb-1">Terjadi Kesalahan</p>
                    <p className="text-sm opacity-90">{error || "Artikel tidak ditemukan"}</p>
                </div>
                <Link
                    href="/articles"
                    className="px-6 py-2.5 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Daftar Artikel
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black font-sans selection:bg-emerald-100 selection:text-emerald-900 pb-20">
            {/* Header / Nav */}
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-100 dark:border-neutral-900">
                <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/articles"
                        className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <button
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-500 dark:text-gray-400"
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: article.title,
                                        url: window.location.href
                                    });
                                }
                            }}
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-2xl mx-auto px-4 py-8">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${article.bg} ${article.color}`}>
                        {article.source}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(article.isoDate)}
                    </span>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {article.title}
                </h1>

                {/* Excerpt Content (Preview) */}
                <div className="prose prose-lg dark:prose-invert prose-emerald text-gray-600 dark:text-gray-300 leading-relaxed mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100 relative">
                    <p className="whitespace-pre-line text-lg">
                        {getPreviewContent(article)}
                    </p>

                    {/* Gradient Fade Effect */}
                    <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white dark:from-black to-transparent pointer-events-none"></div>

                    <div className="mt-8 p-5 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 rounded-2xl flex gap-4">
                        <Info className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                            <p className="font-bold text-gray-900 dark:text-white text-sm">Pratinjau Artikel</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                                Konten ini hanya menampilkan sebagian kecil (1/3) dari artikel asli. Hak cipta sepenuhnya milik penulis dan penerbit yang bersangkutan.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer / CTA */}
                <div className="border-t border-gray-100 dark:border-neutral-800 pt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
                    <div className="bg-gray-50 dark:bg-neutral-900 rounded-2xl p-6 text-center border border-gray-100 dark:border-neutral-800 shadow-sm relative overflow-hidden">
                        {/* Blob decoration */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full -z-0"></div>

                        <div className="relative z-10 space-y-6">
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Sumber Asli
                                </p>
                                <div className="flex items-center justify-center gap-2 text-gray-900 dark:text-white font-black text-xl">
                                    <Globe className="w-5 h-5 text-emerald-500" />
                                    {article.source}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                    Kunjungi website sumber untuk membaca artikel ini secara utuh dan mendapatkan informasi yang valid.
                                </p>
                            </div>

                            <a
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/30 hover:-translate-y-1 w-full md:w-auto"
                            >
                                Baca Selengkapnya
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
}
