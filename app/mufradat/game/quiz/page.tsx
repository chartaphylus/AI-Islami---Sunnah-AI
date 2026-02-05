"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ChevronLeft,
    Sparkles,
    Timer,
    CheckCircle2,
    XCircle,
    Trophy,
    RotateCcw
} from "lucide-react";
import { getRandomMufrodat, Mufrodat } from "../../actions";

interface Question {
    text: string;
    answer: string;
    options: string[];
    correctIndex: number;
    type: 'translate_to_indo' | 'translate_to_arab';
    audio?: string;
}

export default function QuizGamePage() {
    const router = useRouter();
    const [gameState, setGameState] = useState<'loading' | 'countdown' | 'playing' | 'result'>('loading');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes total
    const [startCountdown, setStartCountdown] = useState(3);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Cleanup timer
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    if (timerRef.current) clearInterval(timerRef.current);
                    setGameState('result');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, []);

    const generateQuestions = async () => {
        setLoadingProgress(10);
        const data = await getRandomMufrodat(40); // Fetch plenty to create distractors
        setLoadingProgress(50);

        if (!data || data.length < 10) return; // Should handle error better

        const gameQuestions: Question[] = [];
        // Create 10 questions
        for (let i = 0; i < 10; i++) {
            const item = data[i];
            const type = Math.random() > 0.5 ? 'translate_to_indo' : 'translate_to_arab';

            let text = "";
            let answer = "";
            let options: string[] = [];

            if (type === 'translate_to_indo') {
                text = item.arabic;
                answer = item.translation;
                // Get distractors from other items
                const otherItems = data.filter(d => d.id !== item.id);
                const distractors = otherItems.sort(() => 0.5 - Math.random()).slice(0, 3).map(d => d.translation);
                options = [answer, ...distractors].sort(() => 0.5 - Math.random());
            } else {
                text = item.translation;
                answer = item.arabic;
                const otherItems = data.filter(d => d.id !== item.id);
                const distractors = otherItems.sort(() => 0.5 - Math.random()).slice(0, 3).map(d => d.arabic);
                options = [answer, ...distractors].sort(() => 0.5 - Math.random());
            }

            gameQuestions.push({
                text,
                answer,
                options,
                correctIndex: options.indexOf(answer),
                type,
                audio: item.audio
            });
        }

        setLoadingProgress(100);
        setQuestions(gameQuestions);

        // Start Countdown
        setTimeout(() => {
            setGameState('countdown');
            let count = 3;
            const cdTimer = setInterval(() => {
                count -= 1;
                if (count >= 1) {
                    setStartCountdown(count);
                } else {
                    clearInterval(cdTimer);
                    setGameState('playing');
                    startTimer();
                }
            }, 1000);
        }, 500);
    };

    useEffect(() => {
        generateQuestions();
    }, []);

    const handleAnswer = (index: number) => {
        if (isAnswered) return;

        setSelectedAnswer(index);
        setIsAnswered(true);

        if (index === questions[currentIndex].correctIndex) {
            // Scoring: Base 10 + Time bonus (small)
            const timeBonus = Math.floor(timeLeft / 60);
            setScore(prev => prev + 10 + timeBonus);
        }

        setTimeout(() => {
            if (currentIndex < 9) {
                setCurrentIndex(prev => prev + 1);
                setSelectedAnswer(null);
                setIsAnswered(false);
            } else {
                if (timerRef.current) clearInterval(timerRef.current);
                setGameState('result');
            }
        }, 1500);
    };

    const restartGame = () => {
        setGameState('loading');
        setScore(0);
        setCurrentIndex(0);
        setTimeLeft(180);
        setStartCountdown(3);
        setSelectedAnswer(null);
        setIsAnswered(false);
        generateQuestions();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500 selection:bg-indigo-100 selection:text-indigo-900 pb-20">
            {/* Nav Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link
                        href="/mufradat/game"
                        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-all font-medium group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Kembali</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="font-bold text-slate-900 dark:text-white tracking-tight">Tebak Arti</h1>
                    </div>
                    <div className="w-20"></div> {/* Spacer */}
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">

                {/* Loading State */}
                {gameState === 'loading' && (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-in fade-in duration-500">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 rounded-3xl border-4 border-indigo-500/20 animate-pulse"></div>
                            <div className="absolute inset-0 rounded-3xl border-t-4 border-indigo-500 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-bold text-indigo-600 text-xl">{Math.round(loadingProgress)}%</span>
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Menyiapkan Soal...</h3>
                            <p className="text-slate-500 dark:text-slate-400">Mengambil kosakata secara acak</p>
                        </div>
                    </div>
                )}

                {/* Countdown State */}
                {gameState === 'countdown' && (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in zoom-in duration-300">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
                            <div className="relative w-40 h-40 md:w-60 md:h-60 rounded-full bg-white dark:bg-slate-900 border-8 border-indigo-500 flex items-center justify-center shadow-2xl">
                                <span className="text-8xl md:text-[10rem] font-black text-indigo-600 dark:text-indigo-400 animate-bounce">
                                    {startCountdown}
                                </span>
                            </div>
                        </div>
                        <p className="mt-12 text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-[0.3em] animate-pulse">Bersiap...</p>
                    </div>
                )}

                {/* Playing State */}
                {gameState === 'playing' && questions.length > 0 && (
                    <div className="space-y-4 md:space-y-6 animate-in fade-in zoom-in duration-500">

                        {/* Status Bar */}
                        <div className="flex items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-20 z-40">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 rounded-xl">
                                <Timer className={`w-4 h-4 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-indigo-500'}`} />
                                <span className={`font-mono font-bold text-lg ${timeLeft < 60 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{formatTime(timeLeft)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Soal</span>
                                    <span className="font-bold text-sm text-slate-900 dark:text-white">{currentIndex + 1}<span className="text-slate-400">/10</span></span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Skor</span>
                                    <span className="font-bold text-indigo-600 dark:text-indigo-400 text-sm">{score}</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Line */}
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 transition-all duration-500 ease-out" style={{ width: `${((currentIndex + 1) / 10) * 100}%` }}></div>
                        </div>

                        {/* Question Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-violet-500"></div>

                            <div className="text-center space-y-4 md:space-y-6">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                    {questions[currentIndex].type === 'translate_to_indo' ? 'Apa arti kata ini?' : 'Apa Bahasa Arab dari:'}
                                </p>
                                <p className={`font-bold text-3xl md:text-5xl text-slate-900 dark:text-white leading-relaxed ${questions[currentIndex].type === 'translate_to_indo' ? 'font-serif' : ''}`}>
                                    {questions[currentIndex].text}
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                {questions[currentIndex].options.map((option, i) => {
                                    const isCorrect = i === questions[currentIndex].correctIndex;
                                    const isSelected = selectedAnswer === i;

                                    let style = "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 hover:border-indigo-500 dark:hover:border-indigo-500 text-slate-700 dark:text-slate-300";

                                    if (isAnswered) {
                                        if (isCorrect) style = "border-green-500 bg-green-500 text-white shadow-lg shadow-green-500/30 ring-1 ring-green-500/50";
                                        else if (isSelected) style = "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/30 opacity-80";
                                        else style = "border-slate-100 dark:border-slate-900 bg-slate-100 dark:bg-slate-900 opacity-30 grayscale";
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(i)}
                                            disabled={isAnswered}
                                            className={`p-4 rounded-xl border-2 font-bold text-center transition-all duration-300 flex items-center justify-center gap-2 min-h-[3.5rem] relative ${style} ${questions[currentIndex].type === 'translate_to_arab' ? 'font-serif text-xl' : 'text-base'}`}
                                            dir={questions[currentIndex].type === 'translate_to_arab' ? 'rtl' : 'ltr'}
                                        >
                                            <span className="flex-grow z-10">{option}</span>
                                            {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 shrink-0 absolute right-3" />}
                                            {isAnswered && !isCorrect && isSelected && <XCircle className="w-5 h-5 shrink-0 absolute right-3" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                    </div>
                )}

                {/* Result State */}
                {gameState === 'result' && (
                    <div className="max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-top-8 duration-700 text-center py-8">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-indigo-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative w-32 h-32 md:w-48 md:h-48 bg-white dark:bg-slate-900 rounded-[3rem] mx-auto flex items-center justify-center shadow-2xl border border-slate-200 dark:border-slate-800 rotate-3 group-hover:rotate-6 transition-transform">
                                <Trophy className={`w-16 h-16 md:w-24 md:h-24 ${score >= 80 ? 'text-yellow-500' : 'text-indigo-500'}`} />
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black tracking-widest text-sm shadow-xl">
                                HASIL AKHIR
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                                Score: <span className="text-indigo-600 dark:text-indigo-400">{score}</span>
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg uppercase tracking-widest font-bold pt-2">
                                {score >= 80 ? 'Luar Biasa!' : score >= 50 ? 'Bagus! Tingkatkan lagi' : 'Jangan menyerah!'}
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 pt-4">
                            <button
                                onClick={restartGame}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-indigo-500/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
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
