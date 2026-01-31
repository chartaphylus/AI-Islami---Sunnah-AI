"use client";

import { useState } from 'react';
import React from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Source {
    title: string;
    link: string;
    snippet: string;
}

export default function SearchUI() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [answer, setAnswer] = useState<string | null>(null);
    const [sources, setSources] = useState<Source[]>([]);
    const [error, setError] = useState('');
    const [duration, setDuration] = useState<number | null>(null);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');
        setAnswer(null);
        setSources([]);
        setDuration(null);

        const startTime = Date.now();

        try {
            const response = await axios.post('/api/search', { query });
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setAnswer(response.data.answer);
                setSources(response.data.sources || []);
            }
        } catch (err) {
            setError("Terjadi kesalahan saat mencari jawaban. Silakan coba lagi.");
            console.error(err);
        } finally {
            const endTime = Date.now();
            setDuration((endTime - startTime) / 1000);
            setLoading(false);
        }
    };

    const cleanMarkdown = (text: string) => {
        if (!text) return "";
        let cleaned = text;
        // 1. Fix Headers
        cleaned = cleaned.replace(/^(#+)([^#\s])/gm, '$1 $2');
        // 2. Fix Lists
        cleaned = cleaned.replace(/^([*-])([^\s])/gm, '$1 $2');
        // 3. Remove excessive newlines
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
        return cleaned;
    };

    // Helper to detect Arabic text
    const isArabic = (text: string) => /[\u0600-\u06FF]/.test(text);

    return (
        <div className="w-full">
            <form onSubmit={handleSearch} className="mb-8 relative group z-20">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-white dark:bg-neutral-900 rounded-full shadow-xl shadow-emerald-500/5 ring-1 ring-gray-200 dark:ring-neutral-800 focus-within:ring-2 focus-within:ring-emerald-500 transition-all transform focus-within:scale-[1.01]">
                    <div className="pl-6 text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Apa hukum..."
                        className="w-full py-5 px-4 bg-transparent outline-none text-lg text-gray-800 dark:text-gray-100 placeholder-gray-400"
                    />
                    <div className="pr-2">
                        <button
                            type="submit"
                            disabled={loading || !query.trim()}
                            className="p-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-600/30 transition-all disabled:opacity-70 disabled:hover:shadow-none active:scale-95"
                        >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                    </div>
                </div>
            </form>

            {loading && (
                <div className="glass-card rounded-3xl p-10 mb-6 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in duration-300">
                    {/* Robot Animation */}
                    <div className="relative w-32 h-32 mb-6">
                        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
                            {/* Head */}
                            <rect x="60" y="60" width="80" height="70" rx="15" className="fill-white dark:fill-neutral-800 stroke-emerald-500 stroke-2" />
                            {/* Antenna */}
                            <line x1="100" y1="60" x2="100" y2="40" className="stroke-emerald-500 stroke-2" />
                            <circle cx="100" cy="35" r="6" className="fill-red-500 animate-pulse" />
                            {/* Ears */}
                            <rect x="50" y="80" width="10" height="30" rx="2" className="fill-emerald-200 dark:fill-emerald-900" />
                            <rect x="140" y="80" width="10" height="30" rx="2" className="fill-emerald-200 dark:fill-emerald-900" />
                            {/* Eyes */}
                            <circle cx="85" cy="85" r="8" className="fill-emerald-600 dark:fill-emerald-400 animate-bounce" style={{ animationDelay: '0s' }} />
                            <circle cx="115" cy="85" r="8" className="fill-emerald-600 dark:fill-emerald-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
                            {/* Mouth */}
                            <path d="M 85 110 Q 100 120 115 110" fill="none" className="stroke-gray-400 dark:stroke-gray-500 stroke-2" />
                        </svg>

                        {/* Thinking Bubbles */}
                        <div className="absolute top-0 right-0 flex gap-1 -mt-4 mr-4">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce delay-150"></div>
                            <div className="w-4 h-4 bg-emerald-600 rounded-full animate-bounce delay-300"></div>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                        Sedang Berpikir...
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
                        Menganalisis pertanyaanmu dan mencari referensi yang valid.
                    </p>
                </div>
            )}

            {error && (
                <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 dark:bg-red-900/10 dark:text-red-400 dark:border-red-900/20 text-center animate-in fade-in slide-in-from-top-2">
                    {error}
                </div>
            )}

            {answer && !loading && (
                <div className="space-y-6 pb-32 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out">
                    {/* AI Answer Section */}
                    <div className="glass-card rounded-3xl p-8 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-3xl -z-10 -mr-16 -mt-16 pointer-events-none"></div>

                        <div className="flex justify-between items-start mb-6">
                            <div className="flex flex-col gap-1">
                                <h2 className="flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 text-xl">🤖</span>
                                    Jawaban AI
                                </h2>
                                {duration && (
                                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium ml-1">
                                        Selesai dalam {duration.toFixed(2)} detik
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setQuery('');
                                    setAnswer(null);
                                    setSources([]);
                                    setError('');
                                    setDuration(null);
                                }}
                                className="text-xs px-4 py-2 rounded-full bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-gray-400 hover:bg-emerald-100 hover:text-emerald-700 dark:hover:bg-emerald-900/30 dark:hover:text-emerald-400 transition-colors font-semibold tracking-wide"
                            >
                                PERTANYAAN BARU
                            </button>
                        </div>

                        <div className="prose prose-lg prose-emerald dark:prose-invert max-w-none leading-relaxed text-gray-700 dark:text-gray-300">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={{
                                    h2: ({ node, ...props }) => {
                                        // Check if this is the "Kesimpulan" header
                                        const isConclusion = props.children?.toString().toLowerCase().includes('kesimpulan');
                                        return (
                                            <h2 className={`text-xl font-bold mt-8 mb-4 flex items-center gap-2 pb-2 border-b ${isConclusion ? 'text-emerald-800 dark:text-emerald-300 border-emerald-500' : 'text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50'}`} {...props}>
                                                {isConclusion && <span className="text-2xl">📝</span>}
                                                {props.children}
                                            </h2>
                                        );
                                    },
                                    strong: ({ node, ...props }) => <strong className="font-bold text-emerald-700 dark:text-emerald-400" {...props} />,
                                    ul: ({ node, ...props }) => <ul className="list-disc list-outside ml-5 space-y-2 mb-4 text-left text-gray-700 dark:text-gray-300" {...props} />,
                                    ol: ({ node, ...props }) => <ol className="list-decimal list-outside ml-5 space-y-2 mb-4 text-left text-gray-700 dark:text-gray-300" {...props} />,
                                    li: ({ node, ...props }) => <li className="pl-1" {...props} />,
                                    p: ({ node, children, ...props }) => {
                                        // Helper: Determine if text is PURELY/DOMINANTLY Arabic (e.g. > 85% chars are Arabic)
                                        // This prevents mixed paragraphs (Arabic + Translation) from being treated as a single Arabic block.
                                        const getArabicRatio = (text: string) => {
                                            const arabicMatches = text.match(/[\u0600-\u06FF]/g);
                                            return arabicMatches ? arabicMatches.length / text.length : 0;
                                        };

                                        // Flatten children to text for analysis
                                        const textContent = Array.isArray(children)
                                            ? children.map(c => typeof c === 'string' ? c : (c?.props?.children || '')).join('')
                                            : (typeof children === 'string' ? children : '');

                                        // Stricter threshold: 85% Arabic to be considered a full Arabic Block
                                        const isBlockArabic = getArabicRatio(textContent) > 0.85 && textContent.length > 5;

                                        // Case 1: Pure Arabic Block (Verse/Hadith only)
                                        if (isBlockArabic) {
                                            return (
                                                <p className="font-arabic text-2xl md:text-3xl text-right leading-[2.2] md:leading-[2.5] text-gray-900 dark:text-white font-normal my-8 px-5 py-4 border-r-4 border-emerald-500 bg-emerald-50/30 dark:bg-emerald-900/10 rounded-l-2xl shadow-sm" dir="rtl" {...props}>
                                                    {children}
                                                </p>
                                            );
                                        }

                                        // Case 2: Mixed Content (Indonesian with Inline or Block Arabic segments)
                                        const renderMixed = (content: any): React.ReactNode => {
                                            if (typeof content === 'string') {
                                                // Split by Arabic sequences
                                                // The regex captures Arabic+Space to keep sentences together, but treats punctuation as separators if needed
                                                // Actually, splitting by just arabic chars + space is usually safe enough for inline citation
                                                const parts = content.split(/([\u0600-\u06FF\s]+)/g);

                                                return parts.map((part, i) => {
                                                    // Check if this part has significant Arabic chars
                                                    if (/[\u0600-\u06FF]/.test(part) && part.trim().length > 1) {
                                                        return <span key={i} className="font-arabic text-xl px-1.5 leading-normal inline-block text-emerald-700 dark:text-emerald-400" dir="rtl">{part}</span>;
                                                    }
                                                    return part;
                                                });
                                            }
                                            if (Array.isArray(content)) {
                                                return content.map((c, i) => <React.Fragment key={i}>{renderMixed(c)}</React.Fragment>);
                                            }
                                            if (content?.props?.children) {
                                                return React.cloneElement(content, {
                                                    ...content.props,
                                                    children: renderMixed(content.props.children)
                                                });
                                            }
                                            return content;
                                        };

                                        return <p className="text-left text-gray-700 dark:text-gray-300 mb-4 leading-relaxed" {...props}>{renderMixed(children)}</p>;
                                    },
                                    blockquote: ({ node, ...props }) => {
                                        return (
                                            <div className="my-6 pl-5 border-l-4 border-emerald-400 bg-gray-50 dark:bg-neutral-800/50 p-4 rounded-r-xl italic text-gray-600 dark:text-gray-400">
                                                {props.children}
                                            </div>
                                        );
                                    },
                                    table: ({ node, ...props }) => (
                                        <div className="overflow-x-auto my-6 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-sm">
                                            <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-800 text-sm" {...props} />
                                        </div>
                                    ),
                                    thead: ({ node, ...props }) => <thead className="bg-gray-50 dark:bg-neutral-800/50" {...props} />,
                                    tbody: ({ node, ...props }) => <tbody className="divide-y divide-gray-200 dark:divide-neutral-800 bg-white dark:bg-neutral-900" {...props} />,
                                    tr: ({ node, ...props }) => <tr className="transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/50" {...props} />,
                                    th: ({ node, ...props }) => <th className="px-6 py-4 text-left font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs whitespace-nowrap" {...props} />,
                                    td: ({ node, ...props }) => <td className="px-6 py-4 whitespace-normal text-gray-700 dark:text-gray-300 leading-relaxed align-top" {...props} />
                                }}
                            >
                                {cleanMarkdown(answer)}
                            </ReactMarkdown>
                        </div>

                        {/* Sources Section */}
                        {sources && sources.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-neutral-800 animate-in fade-in slide-in-from-bottom-2">
                                <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                                    Sumber & Referensi
                                </h4>
                                <div className="grid gap-2">
                                    {sources.map((source, idx) => (
                                        <a
                                            key={idx}
                                            href={source.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="group flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-neutral-800/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all border border-transparent hover:border-emerald-200 dark:hover:border-emerald-800"
                                        >
                                            <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-neutral-700 text-xs font-bold text-gray-500 group-hover:text-emerald-600 shadow-sm border border-gray-100 dark:border-neutral-600">
                                                {idx + 1}
                                            </span>
                                            <div className="flex-grow min-w-0">
                                                <div className="font-semibold text-sm text-gray-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400">
                                                    {source.title}
                                                </div>
                                                <div className="text-xs text-gray-500 truncate mt-0.5">
                                                    {source.link ? new URL(source.link).hostname : 'Referensi Teks'}
                                                </div>
                                            </div>
                                            <svg className="w-4 h-4 text-gray-300 group-hover:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
