"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
    ChevronLeft,
    LayoutGrid,
    Timer,
    Trophy,
    RotateCcw,
    TrendingUp
} from "lucide-react";
import { getRandomMufrodat } from "../../actions";
import { motion } from "framer-motion";

interface Card {
    id: number; // Unique ID for key
    content: string;
    type: 'arabic' | 'translation';
    matchId: number; // ID of the word pair
    isFlipped: boolean;
    isMatched: boolean;
}

export default function MatchGamePage() {
    const [gameState, setGameState] = useState<'loading' | 'playing' | 'level_complete' | 'game_over'>('loading');
    const [level, setLevel] = useState(1);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [maxTime, setMaxTime] = useState(0);
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
    const [matchesFound, setMatchesFound] = useState(0);

    // Config
    const getPairCount = (lvl: number) => Math.min(3 + (lvl - 1), 8); // Start 3, max 8 pairs
    const getTimeForLevel = (pairs: number) => pairs * 6; // 6 seconds per pair

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Timer Logic
    useEffect(() => {
        if (gameState === 'playing') {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        setGameState('game_over');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState]);

    const loadLevel = async (currentLevel: number) => {
        setGameState('loading');
        setMatchesFound(0);
        setFlippedIndices([]);

        const pairCount = getPairCount(currentLevel);
        const time = getTimeForLevel(pairCount);
        setMaxTime(time);
        setTimeLeft(time);

        const data = await getRandomMufrodat(pairCount);

        let gameCards: Card[] = [];
        data.forEach((item, index) => {
            gameCards.push({
                id: index * 2,
                content: item.arabic,
                type: 'arabic',
                matchId: item.id,
                isFlipped: false,
                isMatched: false
            });
            gameCards.push({
                id: index * 2 + 1,
                content: item.translation,
                type: 'translation',
                matchId: item.id,
                isFlipped: false,
                isMatched: false
            });
        });

        // Shuffle
        gameCards.sort(() => 0.5 - Math.random());
        setCards(gameCards);

        setTimeout(() => {
            setGameState('playing');
        }, 500);
    };

    useEffect(() => {
        loadLevel(1);
    }, []);

    const handleCardClick = (index: number) => {
        if (gameState !== 'playing') return;
        if (cards[index].isMatched || cards[index].isFlipped) return;
        if (flippedIndices.length >= 2) return;

        // Flip card
        const newCards = [...cards];
        newCards[index].isFlipped = true;
        setCards(newCards);

        const newFlipped = [...flippedIndices, index];
        setFlippedIndices(newFlipped);

        if (newFlipped.length === 2) {
            checkForMatch(newFlipped[0], newFlipped[1]);
        }
    };

    const checkForMatch = (idx1: number, idx2: number) => {
        const card1 = cards[idx1];
        const card2 = cards[idx2];

        if (card1.matchId === card2.matchId) {
            // Match found
            setTimeout(() => {
                const newCards = [...cards];
                newCards[idx1].isMatched = true;
                newCards[idx2].isMatched = true;
                setCards(newCards);
                setFlippedIndices([]);

                // Score depends on speed (timeLeft)
                setScore(prev => prev + 10 + Math.floor(timeLeft / 5));

                const newMatches = matchesFound + 1;
                setMatchesFound(newMatches);

                if (newMatches === cards.length / 2) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    setTimeout(() => {
                        // Level Complete
                        // Auto proceed to next level after brief pause?
                        // Or show "next level" button? 
                        // Let's auto proceed for smoother flow like 'Candy Crush' flow but simpler
                        setGameState('level_complete');
                    }, 500);
                }
            }, 500);
        } else {
            // No match
            setTimeout(() => {
                const newCards = [...cards];
                newCards[idx1].isFlipped = false;
                newCards[idx2].isFlipped = false;
                setCards(newCards);
                setFlippedIndices([]);
                // Penalty? No penalty to discourage guessing, just time loss
            }, 1000);
        }
    };

    const nextLevel = () => {
        setLevel(prev => prev + 1);
        loadLevel(level + 1);
    };

    const restartGame = () => {
        setLevel(1);
        setScore(0);
        loadLevel(1);
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500 selection:bg-violet-100 selection:text-violet-900 pb-20">
            {/* Nav Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/mufradat/game"
                        className="flex items-center gap-2 text-slate-500 hover:text-violet-600 dark:text-slate-400 dark:hover:text-violet-400 transition-all font-medium group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Kembali</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/20">
                            <LayoutGrid className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="font-bold text-slate-900 dark:text-white tracking-tight">Cocokkan Kartu</h1>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="px-3 py-1 bg-violet-50 dark:bg-violet-900/30 rounded-lg text-violet-600 dark:text-violet-400 text-xs font-bold">
                            Level {level}
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">

                {gameState === 'loading' && (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4 animate-pulse">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Level {level}</h2>
                        <p className="text-slate-500">Menyiapkan kartu...</p>
                    </div>
                )}

                {(gameState === 'playing' || gameState === 'level_complete') && (
                    <div className="space-y-6">
                        {/* Status Bar */}
                        <div className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-20 z-40">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                                <Timer className={`w-4 h-4 ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-violet-500'}`} />
                                <span className={`font-mono font-bold text-lg ${timeLeft < 10 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{timeLeft}s</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Total Skor</span>
                                    <span className="font-bold text-violet-600 dark:text-violet-400 text-sm">{score}</span>
                                </div>
                            </div>
                        </div>

                        {/* Timer Progress Bar */}
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ease-linear ${timeLeft < 10 ? 'bg-red-500' : 'bg-violet-500'}`}
                                style={{ width: `${(timeLeft / maxTime) * 100}%` }}
                            ></div>
                        </div>

                        {/* Game Grid */}
                        {cards.length === 0 ? (
                            <div className="text-center py-10 col-span-full">
                                <p className="text-red-500 font-bold mb-2">Gagal memuat kartu.</p>
                                <button onClick={() => loadLevel(level)} className="px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-sm font-bold">Coba Lagi</button>
                            </div>
                        ) : (
                            <div className={`grid gap-3 ${cards.length <= 12 ? 'grid-cols-3' : 'grid-cols-4'}`}>
                                {cards.map((card, idx) => (
                                    <div key={card.id} className="aspect-square h-24 md:h-32" style={{ perspective: "1000px" }}>
                                        <motion.div
                                            className="w-full h-full relative cursor-pointer"
                                            style={{ transformStyle: "preserve-3d" }}
                                            animate={{ rotateY: card.isFlipped || card.isMatched ? 180 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            onClick={() => handleCardClick(idx)}
                                        >
                                            {/* Front (Hidden) */}
                                            <div
                                                className="absolute w-full h-full bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-200 dark:border-slate-800 flex items-center justify-center shadow-sm hover:border-violet-300 transition-colors"
                                                style={{ backfaceVisibility: "hidden" }}
                                            >
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800"></div>
                                            </div>

                                            {/* Back (Revealed) */}
                                            <div
                                                className={`absolute w-full h-full rounded-2xl border-2 flex items-center justify-center shadow-md p-2 text-center select-none overflow-hidden
                                            ${card.isMatched
                                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-500/50 dark:text-emerald-400'
                                                        : 'bg-white border-violet-500 text-slate-900 dark:bg-slate-900 dark:border-violet-500 dark:text-white'
                                                    }`}
                                                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                                            >
                                                <span className={`font-bold ${card.type === 'arabic' ? 'text-2xl font-serif leading-none' : 'text-xs md:text-sm leading-tight'}`}>
                                                    {card.content}
                                                </span>
                                            </div>
                                        </motion.div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Level Complete Overlay */}
                        {gameState === 'level_complete' && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                                <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl space-y-6">
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                        <TrendingUp className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Level Selesai!</h2>
                                        <p className="text-slate-500">Siap untuk level {level + 1}?</p>
                                    </div>
                                    <button
                                        onClick={nextLevel}
                                        className="w-full py-4 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-bold text-lg shadow-xl shadow-violet-500/20"
                                    >
                                        Lanjut Level {level + 1}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {gameState === 'game_over' && (
                    <div className="max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-top-8 duration-700 text-center py-8">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-red-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative w-32 h-32 md:w-48 md:h-48 bg-white dark:bg-slate-900 rounded-[3rem] mx-auto flex items-center justify-center shadow-2xl border border-slate-200 dark:border-slate-800 rotate-3 group-hover:rotate-6 transition-transform">
                                <Timer className="w-16 h-16 md:w-24 md:h-24 text-red-500" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white">Waktu Habis!</h2>
                            <p className="text-slate-500 text-lg">Kamu bertahan sampai <strong>Level {level}</strong></p>
                            <div className="text-6xl font-black text-violet-600 dark:text-violet-400 pt-4">{score}</div>
                            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">Total Skor</p>
                        </div>

                        <div className="flex flex-col gap-4 pt-4">
                            <button
                                onClick={restartGame}
                                className="w-full py-5 bg-violet-600 hover:bg-violet-500 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-violet-500/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                <RotateCcw className="w-6 h-6" />
                                MAIN LAGI
                            </button>
                            <Link
                                href="/mufradat/game"
                                className="w-full py-5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 dark:hover:bg-slate-850 transition-all duration-300 block"
                            >
                                KEMBALI KE MENU
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
