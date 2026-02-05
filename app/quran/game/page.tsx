"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    Trophy,
    Timer,
    CheckCircle2,
    XCircle,
    ChevronLeft,
    Play,
    RotateCcw,
    Gamepad2,
    Brain,
    HelpCircle,
    LayoutGrid
} from 'lucide-react';

type GameState = 'selection' | 'loading' | 'countdown' | 'playing' | 'result';
type GameMode = 'tebak' | 'lanjut';
type Difficulty = 'easy' | 'medium' | 'hard';

interface Question {
    text: string;
    translation?: string;
    options: string[];
    correctIndex: number;
    surahName: string;
    nomorAyat: number;
    nextAyat?: string;
}

interface SurahData {
    id_surah: number;
    title: string;
    verse_count: number;
}

export default function QuranGamePage() {
    const router = useRouter();
    const [gameState, setGameState] = useState<GameState>('selection');
    const [mode, setMode] = useState<GameMode>('tebak');
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
    const [startCountdown, setStartCountdown] = useState(3);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const surahListRef = useRef<SurahData[]>([]);

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

    const fetchQuestion = async (allSurahs: SurahData[]): Promise<Question | null> => {
        try {
            // Filter Surahs based on Difficulty
            let filteredSurahs = allSurahs;
            if (difficulty === 'easy') {
                // Juz 30 approx (Surah 78-114)
                filteredSurahs = allSurahs.filter(s => s.id_surah >= 78);
            } else if (difficulty === 'medium') {
                // Common Surahs (Yasin, Al-Mulk, Al-Waqiah, etc + Juz 30)
                filteredSurahs = allSurahs.filter(s => s.id_surah >= 36 || s.id_surah === 18 || s.id_surah === 12);
            }
            // Hard: All Surahs

            // Pick Random Surah
            const randomSurah = filteredSurahs[Math.floor(Math.random() * filteredSurahs.length)];

            // Pick Random Verse Index
            // Need to fetch verses for this surah from Supabase
            // Optimization: We could fetch just one random verse, but to ensure valid next verse for 'lanjut' we might need logic

            // Randomly select a verse number
            // For 'lanjut', avoid the very last verse
            const maxVerse = mode === 'lanjut' ? randomSurah.verse_count - 1 : randomSurah.verse_count;
            if (maxVerse < 1) return null; // Should not happen for valid surahs

            const randomVerseNum = Math.floor(Math.random() * maxVerse) + 1;

            // Fetch the verse(s)
            const { data: verses, error } = await supabase
                .from('ayat_quran')
                .select('verse_number, text_ar, translation_id')
                .eq('surah_id', randomSurah.id_surah)
                .in('verse_number', mode === 'lanjut' ? [randomVerseNum, randomVerseNum + 1] : [randomVerseNum]);

            if (error || !verses || verses.length === 0) throw error;

            const pickedAyah = verses.find(v => v.verse_number === randomVerseNum);
            if (!pickedAyah) return null;

            let question: Question;

            if (mode === 'tebak') {
                // Options are Surah Names
                const distractors = allSurahs
                    .filter(s => s.id_surah !== randomSurah.id_surah)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3)
                    .map(s => s.title);

                const options = [randomSurah.title, ...distractors].sort(() => 0.5 - Math.random());

                question = {
                    text: pickedAyah.text_ar,
                    translation: pickedAyah.translation_id,
                    options,
                    correctIndex: options.indexOf(randomSurah.title),
                    surahName: randomSurah.title,
                    nomorAyat: pickedAyah.verse_number
                };

            } else {
                // Mode Lanjut: Question is Ayah N, Answer is Ayah N+1
                const nextAyah = verses.find(v => v.verse_number === randomVerseNum + 1);

                if (!nextAyah) {
                    // Fallback if next ayah fetch failed for some reason
                    return null;
                }

                // Get distractors: Random verses from other places
                // We make a separate call for distractors to ensure randomness
                const { data: randomDistractors } = await supabase.rpc('get_random_verses', { limit_num: 3 });
                // Since we don't have RPC, we fallback to client-side random fetch:
                // Just fetch 3 random verses from a random surah
                const randomDistractorSurahId = Math.floor(Math.random() * 114) + 1;
                const { data: distractorVerses } = await supabase
                    .from('ayat_quran')
                    .select('text_ar')
                    .eq('surah_id', randomDistractorSurahId)
                    .limit(3);

                let distractors = (distractorVerses || []).map(v => v.text_ar);
                // Pad if not enough
                if (distractors.length < 3) distractors = ["Distractor 1", "Distractor 2", "Distractor 3"]; // Should rarely happen

                const optionsArr = [nextAyah.text_ar, ...distractors].sort(() => 0.5 - Math.random());

                question = {
                    text: pickedAyah.text_ar,
                    options: optionsArr,
                    correctIndex: optionsArr.indexOf(nextAyah.text_ar),
                    surahName: randomSurah.title,
                    nomorAyat: pickedAyah.verse_number,
                    nextAyat: nextAyah.text_ar
                };
            }

            return question;

        } catch (error) {
            console.error("Fetch question error:", error);
            return null;
        }
    };

    const startGame = async () => {
        setGameState('loading');
        setLoadingProgress(0);
        setQuestions([]);
        setCurrentIndex(0);
        setScore(0);
        setTimeLeft(180);

        try {
            // 1. Fetch Surah List if not already
            if (surahListRef.current.length === 0) {
                const { data, error } = await supabase
                    .from('daftar_surah') // Changed from 'surat' per schema
                    .select('id_surah, title, verse_count'); // Changed fields

                if (error) throw error;
                surahListRef.current = data || [];
            }

            const surahList = surahListRef.current;
            const newQuestions: Question[] = [];

            // Generate 10 Questions
            for (let i = 0; i < 10; i++) {
                // Retry logic if null returned
                let q = null;
                let attempts = 0;
                while (!q && attempts < 3) {
                    q = await fetchQuestion(surahList);
                    attempts++;
                }

                if (q) newQuestions.push(q);
                setLoadingProgress(((i + 1) / 10) * 100);
            }

            setQuestions(newQuestions);
            setGameState('countdown');
            setStartCountdown(3);

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

        } catch (error) {
            console.error("Start game failed", error);
            setGameState('selection');
            // Optionally show error toast
        }
    };

    const handleAnswer = (index: number) => {
        if (isAnswered) return;

        setSelectedAnswer(index);
        setIsAnswered(true);

        if (index === questions[currentIndex].correctIndex) {
            // Scoring: Base 10 + Time bonus
            const timeBonus = Math.floor(timeLeft / 30);
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

    const resetGame = () => {
        setGameState('selection');
        setSelectedAnswer(null);
        setIsAnswered(false);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] dark:bg-[#020617] transition-colors duration-500 selection:bg-emerald-100 selection:text-emerald-900 pb-20">
            {/* Nav Header */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <button
                        onClick={() => gameState === 'selection' ? router.push('/') : resetGame()}
                        className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-all font-medium group"
                    >
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span>Kembali</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <Gamepad2 className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="font-bold text-slate-900 dark:text-white tracking-tight">Game Quran</h1>
                    </div>
                    <div className="w-20"></div> {/* Spacer */}
                </div>
            </div>

            <main className="max-w-4xl mx-auto px-4 py-8">
                {/* Selection State */}
                {gameState === 'selection' && (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="text-center space-y-2 md:space-y-4">
                            <h2 className="text-2xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Pilih <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Mode Game</span>
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-sm md:text-lg max-w-md mx-auto">Uji hafalan dan pengetahuan Al-Qur'an Anda</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Mode Tebak */}
                            <button
                                onClick={() => setMode('tebak')}
                                className={`group p-5 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden flex items-center gap-4 ${mode === 'tebak'
                                    ? 'border-emerald-500 bg-white dark:bg-slate-900 shadow-xl shadow-emerald-500/10'
                                    : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 hover:border-emerald-200 dark:hover:border-emerald-900/50'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500 ${mode === 'tebak' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                    <HelpCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={`text-lg font-bold transition-colors duration-500 ${mode === 'tebak' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>Tebak Nama Surat</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">Tebak surat dari potongan ayat</p>
                                </div>
                            </button>

                            {/* Mode Lanjut */}
                            <button
                                onClick={() => setMode('lanjut')}
                                className={`group p-5 rounded-2xl border transition-all duration-300 text-left relative overflow-hidden flex items-center gap-4 ${mode === 'lanjut'
                                    ? 'border-teal-500 bg-white dark:bg-slate-900 shadow-xl shadow-teal-500/10'
                                    : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 hover:border-teal-200 dark:hover:border-teal-900/50'
                                    }`}
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500 ${mode === 'lanjut' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                    <Brain className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className={`text-lg font-bold transition-colors duration-500 ${mode === 'lanjut' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>Lanjutkan Ayat</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">Pilih kelanjutan ayat yang benar</p>
                                </div>
                            </button>
                        </div>

                        {/* Difficulty */}
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

                        <div className="pt-4">
                            <button
                                onClick={startGame}
                                className="w-full relative px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl font-bold text-white text-lg shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2 active:scale-95"
                            >
                                <Play className="w-5 h-5 fill-current" />
                                MULAI PERMAINAN
                            </button>
                        </div>
                    </div>
                )}

                {/* Loading State */}
                {gameState === 'loading' && (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 animate-in fade-in duration-500">
                        <div className="relative w-24 h-24">
                            <div className="absolute inset-0 rounded-3xl border-4 border-emerald-500/20 animate-pulse"></div>
                            <div className="absolute inset-0 rounded-3xl border-t-4 border-emerald-500 animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="font-bold text-emerald-600 text-xl">{Math.round(loadingProgress)}%</span>
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Menyiapkan Soal...</h3>
                            <p className="text-slate-500 dark:text-slate-400">Sedang mengambil ayat-ayat terbaik untuk Anda</p>
                        </div>
                        <div className="w-64 h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${loadingProgress}%` }}></div>
                        </div>
                    </div>
                )}

                {/* Countdown State */}
                {gameState === 'countdown' && (
                    <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in zoom-in duration-300">
                        <div className="relative">
                            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
                            <div className="relative w-40 h-40 md:w-60 md:h-60 rounded-full bg-white dark:bg-slate-900 border-8 border-emerald-500 flex items-center justify-center shadow-2xl">
                                <span className="text-8xl md:text-[10rem] font-black text-emerald-600 dark:text-emerald-400 animate-bounce">
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
                                <Timer className={`w-4 h-4 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`} />
                                <span className={`font-mono font-bold text-lg ${timeLeft < 60 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{formatTime(timeLeft)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Soal</span>
                                    <span className="font-bold text-sm text-slate-900 dark:text-white">{currentIndex + 1}<span className="text-slate-400">/10</span></span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Skor</span>
                                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">{score}</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Line */}
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: `${((currentIndex + 1) / 10) * 100}%` }}></div>
                        </div>

                        {/* Question Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5 space-y-6 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

                            <div className="text-center space-y-4 md:space-y-6">
                                <p className="font-arabic text-2xl md:text-4xl text-slate-900 dark:text-white leading-[1.8] md:leading-[2.2]" dir="rtl">
                                    {questions[currentIndex].text}
                                </p>

                                {mode === 'tebak' && difficulty !== 'hard' && questions[currentIndex].translation && (
                                    <div className="p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-100 dark:border-slate-800 italic text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
                                        "{questions[currentIndex].translation}"
                                    </div>
                                )}
                            </div>

                            <div className={`grid gap-3 pt-2 ${mode === 'tebak' ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {questions[currentIndex].options.map((option, i) => {
                                    const isCorrect = i === questions[currentIndex].correctIndex;
                                    const isSelected = selectedAnswer === i;

                                    let style = "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 hover:border-emerald-500 dark:hover:border-emerald-500 text-slate-700 dark:text-slate-300";

                                    if (isAnswered) {
                                        if (isCorrect) style = "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 ring-1 ring-emerald-500/50";
                                        else if (isSelected) style = "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/30 opacity-80";
                                        else style = "border-slate-100 dark:border-slate-900 bg-slate-100 dark:bg-slate-900 opacity-30 grayscale";
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(i)}
                                            disabled={isAnswered}
                                            className={`p-4 rounded-xl border-2 font-bold text-center transition-all duration-300 flex items-center justify-center gap-2 min-h-[3.5rem] relative ${style} ${mode === 'lanjut' ? 'font-arabic text-lg py-5 leading-loose' : 'text-sm md:text-base'}`}
                                            dir={mode === 'lanjut' ? 'rtl' : 'ltr'}
                                        >
                                            <span className="flex-grow z-10">{option}</span>
                                            {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 shrink-0 absolute right-3" />}
                                            {isAnswered && !isCorrect && isSelected && <XCircle className="w-5 h-5 shrink-0 absolute right-3" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <p className="text-center text-slate-400 dark:text-slate-600 text-[10px] font-medium uppercase tracking-widest pb-4">Pilih jawaban yang benar</p>
                    </div>
                )}

                {/* Result State */}
                {gameState === 'result' && (
                    <div className="max-w-xl mx-auto space-y-10 animate-in fade-in slide-in-from-top-8 duration-700 text-center py-8">
                        {/* Trophy Header */}
                        <div className="relative group">
                            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[80px] opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative w-32 h-32 md:w-48 md:h-48 bg-white dark:bg-slate-900 rounded-[3rem] mx-auto flex items-center justify-center shadow-2xl border border-slate-200 dark:border-slate-800 rotate-3 group-hover:rotate-6 transition-transform">
                                <Trophy className={`w-16 h-16 md:w-24 md:h-24 ${score >= 80 ? 'text-yellow-500' : 'text-emerald-500'}`} />
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-black tracking-widest text-sm shadow-xl">
                                HASIL AKHIR
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
                                Score: <span className="text-emerald-600 dark:text-emerald-400">{score}</span>
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg uppercase tracking-widest font-bold pt-2">
                                {score >= 80 ? 'Maa Syaa Allah! Luar Biasa' : score >= 50 ? 'Alhamdulillah! Terus Berlatih' : 'Tetap Semangat! Ayo Coba Lagi'}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-8">
                            <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5">
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Soal</span>
                                <span className="text-2xl font-black text-slate-900 dark:text-white">10</span>
                            </div>
                            <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5">
                                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Sisa Waktu</span>
                                <span className="text-2xl font-black text-slate-900 dark:text-white">{formatTime(timeLeft)}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4 pt-4">
                            <button
                                onClick={startGame}
                                className="w-full py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black text-xl shadow-2xl shadow-emerald-500/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                            >
                                <RotateCcw className="w-6 h-6" />
                                MAIN LAGI
                            </button>
                            <button
                                onClick={resetGame}
                                className="w-full py-5 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 font-bold hover:bg-slate-50 dark:hover:bg-slate-850 transition-all duration-300"
                            >
                                UBAH MODE
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
