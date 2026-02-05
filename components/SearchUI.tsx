"use client";

import { useState, useRef, useEffect, Suspense } from 'react';
import React from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Check, Copy, MessageCircle, Send, User, Bot, Sparkles, ChevronLeft, Clock } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface Source {
    title: string;
    link: string;
    snippet: string;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    sources?: Source[];
    cached?: boolean;
    timestamp: Date;
    latency?: string;
}

function SearchUIContent() {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [error, setError] = useState('');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const searchParams = useSearchParams();
    const hasAutoTriggered = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Auto-Trigger Logic
    useEffect(() => {
        if (hasAutoTriggered.current) return;

        const context = searchParams.get('context');
        const era = searchParams.get('era');
        const eraId = searchParams.get('era_id');

        if (eraId) {
            hasAutoTriggered.current = true;
            setLoading(true);

            axios.get(`/api/eras/${eraId}`)
                .then(res => {
                    const eraData = res.data;
                    if (eraData) {
                        const autoPrompt = `
Buatlah rangkuman sejarah yang SANGAT LENGKAP, MENDALAM, dan KOMPREHENSIF tentang era: **${eraData.era_name} (${eraData.year_start_m} - ${eraData.year_end_m} M)**.

Gunakan struktur berikut dalam jawabanmu:
1.  **Latar Belakang & Pendirian**: Bagaimana era ini dimulai? Siapa tokoh kuncinya? Apa konteks politik saat itu?
2.  **Masa Keemasan**: Jelaskan pencapaian terbesar di bidang ilmu pengetahuan, militer, arsitektur, dan ekonomi. Sebutkan tokoh ilmuwan atau jenderal terkenal.
3.  **Pemimpin Utama**: Jelaskan secara detail tentang pemimpin-pemimpin berikut: ${JSON.stringify(eraData.leader_info)}. Apa kontribusi spesifik mereka?
4.  **Peristiwa Penting**: Uraikan peristiwa-peristiwa ini secara kronologis dan dampaknya: ${JSON.stringify(eraData.key_events)}.
5.  **Peninggalan & Warisan**: Jelaskan detail tentang peninggalan fisik (bangunan, artefak) dan non-fisik (sistem pemerintahan, karya tulis).
6.  **Keruntuhan**: Apa penyebab utama kejatuhan era ini? Faktor internal dan eksternal.

Informasi tambahan dari database: "${eraData.description}".

Jawablah dengan gaya bahasa yang edukatif, mengalir, dan menarik, namun tetap akademis dan berdasarkan fakta sejarah yang valid. Gunakan formatting Markdown (seperti bold, list, quote) agar mudah dibaca.
                        `.trim();

                        // Immediate UI update
                        const newUserMessage: Message = {
                            id: Date.now().toString(),
                            role: 'user',
                            content: `Tanya AI tentang: ${eraData.era_name}`, // Show shorter text to user? OR show full prompt. User requested "Prompt ringkasan data era".
                            timestamp: new Date()
                        };
                        setMessages([newUserMessage]);

                        // Execute Search with full prompt hidden or visible? 
                        // Logic below sends 'autoPrompt' as content.
                        return axios.post('/api/search', { messages: [{ role: 'user', content: autoPrompt }] });
                    }
                })
                .then(response => {
                    if (response && !response.data.error) {
                        const aiMessage: Message = {
                            id: (Date.now() + 1).toString(),
                            role: 'assistant',
                            content: response.data.answer,
                            sources: response.data.sources || [],
                            cached: response.data.cached,
                            timestamp: new Date(),
                            latency: response.data.latency
                        };
                        setMessages(prev => [...prev, aiMessage]);
                    }
                })
                .catch(err => {
                    setError("Gagal memuat informasi era.");
                    console.error(err);
                })
                .finally(() => {
                    setLoading(false);
                });

        } else if (context === 'history' && era) {
            hasAutoTriggered.current = true;
            const autoPrompt = `Jelaskan sejarah lengkap dan mendalam tentang era ${era}, mencakup pencapaian, kepemimpinan, dan warisannya dalam peradaban Islam. Berikan referensi yang valid.`;

            // Immediate UI update
            const newUserMessage: Message = {
                id: Date.now().toString(),
                role: 'user',
                content: autoPrompt,
                timestamp: new Date()
            };
            setMessages([newUserMessage]);
            setLoading(true);

            // Execute Search
            (async () => {
                try {
                    const response = await axios.post('/api/search', { messages: [{ role: 'user', content: autoPrompt }] });
                    if (!response.data.error) {
                        const aiMessage: Message = {
                            id: (Date.now() + 1).toString(),
                            role: 'assistant',
                            content: response.data.answer,
                            sources: response.data.sources || [],
                            cached: response.data.cached,
                            timestamp: new Date(),
                            latency: response.data.latency
                        };
                        setMessages(prev => [...prev, aiMessage]);
                    }
                } catch (err) {
                    setError("Maaf, terjadi kendala teknis saat memuat sejarah.");
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [searchParams]);

    // Auto-expand textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
        }
    }, [query]);

    const handleCopy = (content: string, id: string) => {
        navigator.clipboard.writeText(content);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleShareWhatsApp = (content: string) => {
        const url = `https://wa.me/?text=${encodeURIComponent(content)}`;
        window.open(url, '_blank');
    };

    const handleSearch = async (e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmedQuery = query.trim();
        if (!trimmedQuery || loading) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: trimmedQuery,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMessage]);
        setQuery('');
        setLoading(true);
        setError('');

        try {
            const history = messages.map(msg => ({
                role: msg.role,
                content: msg.content
            }));
            history.push({ role: 'user', content: trimmedQuery });

            const response = await axios.post('/api/search', { messages: history });

            if (response.data.error) {
                setError(response.data.error);
            } else {
                const aiMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: response.data.answer,
                    sources: response.data.sources || [],
                    cached: response.data.cached,
                    timestamp: new Date(),
                    latency: response.data.latency
                };
                setMessages(prev => [...prev, aiMessage]);
            }
        } catch (err) {
            setError("Maaf, terjadi kendala teknis. Silakan coba sebentar lagi.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
        }
    };

    const cleanMarkdown = (text: string) => {
        if (!text) return "";
        let cleaned = text;
        cleaned = cleaned.replace(/^(#+)([^#\s])/gm, '$1 $2');
        cleaned = cleaned.replace(/^([*-])([^\s])/gm, '$1 $2');
        cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
        return cleaned;
    };

    const isArabic = (text: string) => {
        const arabicPattern = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
        return arabicPattern.test(text);
    };

    return (
        <div className="flex flex-col h-full md:h-[750px] bg-white dark:bg-neutral-900 md:rounded-[2.5rem] overflow-hidden border-x border-b md:border border-gray-100 dark:border-neutral-800 shadow-2xl md:shadow-emerald-500/5">
            {/* Internal Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-gray-100 dark:border-neutral-800 z-30">
                <div className="flex items-center gap-3">
                    <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-500" />
                    </Link>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-base md:text-lg font-bold text-gray-900 dark:text-white leading-none font-inter">Haditha AI</h1>
                        <p className="text-[10px] text-emerald-600 font-medium mt-1 uppercase tracking-wider">Online • Manhaj Salaf</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setMessages([])}
                        className="text-[10px] md:text-xs font-bold px-3 py-2 rounded-full bg-gray-50 dark:bg-neutral-800 text-gray-500 hover:text-red-500 transition-colors"
                    >
                        Hapus Chat
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-grow overflow-y-auto p-4 md:p-10 space-y-6 md:space-y-8 scrollbar-thin scrollbar-thumb-gray-100 dark:scrollbar-thumb-neutral-800">
                {messages.length === 0 && !loading && (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in zoom-in duration-700">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                            <div className="relative p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 border border-emerald-100 dark:border-emerald-800/50">
                                <Sparkles className="w-12 h-12" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white px-4">Assalamu'alaikum, Akhi/Ukhti!</p>
                            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto px-4">
                                Tanyakan apa pun tentang syariah, Haditha siap membantu menjawab sesuai Al-Qur'an dan Sunnah.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 max-w-lg w-full px-4">
                            {["Apa hukum Shalat Berjamaah?", "Kapan waktu Shalat Dhuha?", "Adab kepada Orang Tua", "Tanda-tanda Hari Kiamat"].map((suggest, i) => (
                                <button
                                    key={i}
                                    onClick={() => { setQuery(suggest); setTimeout(handleSearch, 10); }}
                                    className="p-3 text-xs md:text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-neutral-800 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 border border-gray-100 dark:border-neutral-700 transition-all text-left"
                                >
                                    {suggest}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-6 duration-500`}
                    >
                        <div className={`flex gap-3 md:gap-4 max-w-[95%] md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row items-start'}`}>
                            {/* Avatar Wrapper */}
                            <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center shadow-lg transform transition-transform hover:scale-110 ${msg.role === 'user'
                                ? 'bg-gradient-to-br from-emerald-600 to-teal-600 text-white'
                                : 'bg-white dark:bg-neutral-800 text-emerald-600 border border-gray-100 dark:border-neutral-700'
                                }`}>
                                {msg.role === 'user' ? <User className="w-4 h-4 md:w-5 md:h-5" /> : <Bot className="w-4 h-4 md:w-5 md:h-5" />}
                            </div>

                            {/* Content Bubble */}
                            <div className={`flex flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                <div className={`relative px-4 md:px-5 py-3 md:py-4 rounded-[1.2rem] md:rounded-[1.5rem] shadow-sm transform transition-all ${msg.role === 'user'
                                    ? 'bg-emerald-600 text-white rounded-tr-none ring-4 ring-emerald-500/10'
                                    : 'bg-white dark:bg-neutral-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-neutral-700/50 rounded-tl-none ring-4 ring-gray-500/5'
                                    }`}>
                                    <div className={`prose prose-sm md:prose-base dark:prose-invert max-w-none break-words leading-relaxed ${msg.role === 'user' ? 'text-white' : ''}`}>
                                        <ReactMarkdown
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({ children }) => {
                                                    const textContent = React.Children.toArray(children).join("");
                                                    const isAr = isArabic(textContent);
                                                    return (
                                                        <p
                                                            className={`mb-4 last:mb-0 leading-relaxed text-sm md:text-base ${isAr ? 'font-arabic text-2xl md:text-3xl text-right dir-rtl leading-loose' : 'text-left'}`}
                                                            style={isAr ? { direction: 'rtl' } : {}}
                                                        >
                                                            {children}
                                                        </p>
                                                    );
                                                },
                                                li: ({ children }) => <li className="mb-2 text-sm md:text-base">{children}</li>,
                                                table: ({ children }) => <div className="overflow-x-auto my-4"><table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">{children}</table></div>,
                                                th: ({ children }) => <th className="px-4 py-2 bg-gray-50 dark:bg-neutral-900 text-left font-bold">{children}</th>,
                                                td: ({ children }) => <td className="px-4 py-2 border-t border-gray-100 dark:border-neutral-800">{children}</td>
                                            }}
                                        >
                                            {cleanMarkdown(msg.content)}
                                        </ReactMarkdown>
                                    </div>

                                    {/* Action bar and Sources */}
                                    {(msg.sources && msg.sources.length > 0) || msg.role === 'assistant' ? (
                                        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-neutral-700/50 flex flex-col gap-3">
                                            {/* Sources Grid */}
                                            {msg.sources && msg.sources.length > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {msg.sources.slice(0, 3).map((src, i) => (
                                                        <a
                                                            key={i}
                                                            href={src.link}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="flex items-center gap-2 text-[9px] px-2 py-1 rounded bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-700 hover:border-emerald-500 hover:text-emerald-600 transition-all truncate max-w-[150px]"
                                                        >
                                                            <Sparkles className="w-2.5 h-2.5 flex-shrink-0" />
                                                            {src.title}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Final Actions */}
                                            {msg.role === 'assistant' && (
                                                <div className="flex items-center flex-wrap gap-2">
                                                    <button onClick={() => handleCopy(msg.content, msg.id)} className="p-1.5 px-2.5 rounded-lg bg-gray-50 dark:bg-neutral-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-gray-400 hover:text-emerald-600 transition-all flex items-center gap-1.5 text-[10px] font-bold">
                                                        {copiedId === msg.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                                        Salin
                                                    </button>
                                                    <button onClick={() => handleShareWhatsApp(msg.content)} className="p-1.5 px-2.5 rounded-lg bg-gray-50 dark:bg-neutral-900 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-gray-400 hover:text-emerald-600 transition-all flex items-center gap-1.5 text-[10px] font-bold">
                                                        <MessageCircle className="w-3 h-3" />
                                                        WhatsApp
                                                    </button>
                                                    {msg.latency && (
                                                        <span className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-50 dark:bg-neutral-900 text-gray-400 text-[9px] font-medium border border-gray-100 dark:border-neutral-700">
                                                            <Clock className="w-2.5 h-2.5" /> {msg.latency}s
                                                        </span>
                                                    )}
                                                    {msg.cached && (
                                                        <span className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50/50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[8px] font-black italic border border-emerald-100 dark:border-emerald-800/30">
                                                            KILAT
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : null}
                                </div>
                                <div className="flex items-center gap-2 px-1">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest opacity-70">
                                        {msg.role === 'user' ? 'Anda' : 'Haditha'} • {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {loading && (
                    <div className="flex justify-start animate-in fade-in slide-in-from-left-4 duration-500">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center text-emerald-600 border border-gray-100 dark:border-neutral-700 shadow-sm">
                                <Bot className="w-4 h-4 md:w-5 md:h-5 animate-pulse" />
                            </div>
                            <div className="bg-white dark:bg-neutral-800 px-5 py-4 rounded-2xl border border-gray-100 dark:border-neutral-700 rounded-tl-none shadow-sm flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-bounce"></div>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-[10px] md:text-xs rounded-xl text-center border border-red-100 dark:border-red-900/20 animate-in shake">
                        {error}
                    </div>
                )}

                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-8 bg-white dark:bg-neutral-900 border-t border-gray-100 dark:border-neutral-800 z-20">
                <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="group relative flex items-end gap-2 md:gap-3">
                    <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-[1.8rem] blur opacity-5 group-focus-within:opacity-15 transition duration-500"></div>
                    <div className="relative flex-grow">
                        <textarea
                            ref={textareaRef}
                            rows={1}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Tanyakan fatwa, hadits, atau hukum..."
                            className="w-full py-4 px-6 md:py-5 md:px-8 bg-gray-50 dark:bg-neutral-800/80 rounded-[1.5rem] md:rounded-[1.8rem] outline-none border border-transparent focus:border-emerald-500/50 focus:bg-white dark:focus:bg-neutral-800 transition-all text-sm md:text-base text-gray-800 dark:text-gray-100 placeholder-gray-400 shadow-inner resize-none min-h-[56px] md:min-h-[64px]"
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading || !query.trim()}
                        className="relative p-4 md:p-5 bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-[1.2rem] md:rounded-[1.5rem] hover:shadow-xl hover:shadow-emerald-500/30 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 disabled:shadow-none mb-[2px]"
                    >
                        <Send className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                </form>
                <div className="flex items-center justify-center gap-4 mt-3 md:mt-5 opacity-40">
                    <p className="text-[8px] md:text-[10px] text-gray-400 font-bold tracking-[0.2em] uppercase">
                        Sesuai Manhaj Salaf • Data Tervalidasi • Cepat • Akurat
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function SearchUI() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-emerald-500 font-bold animate-pulse">Memuat Sistem AI...</div>}>
            <SearchUIContent />
        </Suspense>
    );
}
