"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    Sparkles,
    BrainCircuit,
    LayoutGrid,
    Play
} from "lucide-react";

type GameMode = 'quiz' | 'match';
type Difficulty = 'easy' | 'medium' | 'hard';

export default function MufrodatGameMenu() {
    const router = useRouter();
    const [mode, setMode] = useState<GameMode>('quiz');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');

    const startGame = () => {
        // Navigate to the selected game mode
        // We can pass difficulty as query param if needed in the future
        if (mode === 'quiz') {
            router.push('/mufradat/game/quiz');
        } else {
            router.push('/mufradat/game/match');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500 selection:bg-indigo-100 selection:text-indigo-900 pb-20">

            {/* Nav Header - Matching Quran Game */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-all font-medium group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Kembali</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="font-bold text-slate-900 dark:text-white tracking-tight">Game Mufrodat</h1>
                    </div>
                    <div className="w-20"></div> {/* Spacer */}
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">

                    {/* Title Section */}
                    <div className="text-center space-y-2 md:space-y-4">
                        <h2 className="text-2xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Pilih <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Mode Game</span>
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg max-w-md mx-auto">
                            Uji hafalan kosakata Bahasa Arab Anda
                        </p>
                    </div>

                    {/* Mode Selection Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Mode Tebak Arti */}
                        <button
                            onClick={() => setMode('quiz')}
                            className={`group p-5 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden flex items-center gap-4 ${mode === 'quiz'
                                ? 'border-indigo-500 bg-white dark:bg-slate-900 shadow-xl shadow-indigo-500/10'
                                : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 hover:border-indigo-200 dark:hover:border-indigo-900/50'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500 ${mode === 'quiz' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                <BrainCircuit className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold transition-colors duration-500 ${mode === 'quiz' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>Tebak Arti</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">Kuis pilihan ganda untuk menguji ingatanmu</p>
                            </div>
                        </button>

                        {/* Mode Cocokkan Kartu */}
                        <button
                            onClick={() => setMode('match')}
                            className={`group p-5 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden flex items-center gap-4 ${mode === 'match'
                                ? 'border-violet-500 bg-white dark:bg-slate-900 shadow-xl shadow-violet-500/10'
                                : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 hover:border-violet-200 dark:hover:border-violet-900/50'
                                }`}
                        >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500 ${mode === 'match' ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                <LayoutGrid className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className={`text-lg font-bold transition-colors duration-500 ${mode === 'match' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>Cocokkan Kartu</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">Mainkan memori dengan mencocokkan pasangan</p>
                            </div>
                        </button>
                    </div>

                    {/* Difficulty Selector */}
                    <div className="space-y-3 pt-2">
                        <h4 className="text-slate-900 dark:text-white font-bold text-center text-sm uppercase tracking-wider">Tingkat Kesulitan</h4>
                        <div className="flex justify-center gap-2 md:gap-3">
                            {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDifficulty(d)}
                                    className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-300 border ${difficulty === d
                                        ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-lg'
                                        : 'bg-white dark:bg-slate-950/50 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                                        }`}
                                >
                                    {d === 'easy' ? 'Mudah' : d === 'medium' ? 'Sedang' : 'Sulit'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Start Button */}
                    <div className="pt-4">
                        <button
                            onClick={startGame}
                            className="w-full relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-500 rounded-2xl font-bold text-white text-lg shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                        >
                            <Play className="w-5 h-5 fill-current" />
                            MULAI PERMAINAN
                        </button>
                    </div>

                </div>
            </main>
        </div>
    );
}
