"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

    // Stop timer on cleanup
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

    const fetchQuestion = async (surahs: any[]) => {
        try {
            // Pick a random surah based on difficulty
            // Easy: Only Juz 30 (Surah 78-114)
            // Medium: Any Surah
            // Hard: Any Surah, but obscure content
            let filteredSurahs = surahs;
            if (difficulty === 'easy') {
                filteredSurahs = surahs.filter(s => s.nomor >= 78);
            }

            const randomSurah = filteredSurahs[Math.floor(Math.random() * filteredSurahs.length)];
            const res = await axios.get(`https://equran.id/api/v2/surat/${randomSurah.nomor}`);
            const surahData = res.data.data;

            // Randomly pick an ayah
            // For "Lanjutkan", don't pick the last ayah
            let ayahIndex;
            if (mode === 'lanjut') {
                ayahIndex = Math.floor(Math.random() * (surahData.ayat.length - 1));
            } else {
                ayahIndex = Math.floor(Math.random() * surahData.ayat.length);
            }

            const pickedAyah = surahData.ayat[ayahIndex];

            let question: Question;

            if (mode === 'tebak') {
                // Options are surah names
                const distractors = surahs
                    .filter(s => s.nomor !== randomSurah.nomor)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3)
                    .map(s => s.namaLatin);

                const options = [randomSurah.namaLatin, ...distractors].sort(() => 0.5 - Math.random());

                question = {
                    text: pickedAyah.teksArab,
                    translation: pickedAyah.teksIndonesia,
                    options,
                    correctIndex: options.indexOf(randomSurah.namaLatin),
                    surahName: randomSurah.namaLatin,
                    nomorAyat: pickedAyah.nomorAyat
                };
            } else {
                // Lanjutkan Ayat: Options are next verses
                const nextAyah = surahData.ayat[ayahIndex + 1];

                // Get distractors from other ayahs in the same surah or nearby surahs
                let distractors = surahData.ayat
                    .filter((a: any) => a.nomorAyat !== nextAyah.nomorAyat && a.nomorAyat !== pickedAyah.nomorAyat)
                    .sort(() => 0.5 - Math.random())
                    .slice(0, 3)
                    .map((a: any) => a.teksArab);

                if (distractors.length < 3) {
                    // If surah is too short, get distractors from another surah
                    const otherSurahRes = await axios.get(`https://equran.id/api/v2/surat/${Math.floor(Math.random() * 114) + 1}`);
                    distractors = [...distractors, ...otherSurahRes.data.data.ayat.slice(0, 3).map((a: any) => a.teksArab)].slice(0, 3);
                }

                const optionsArr = [nextAyah.teksArab, ...distractors].sort(() => 0.5 - Math.random());

                question = {
                    text: pickedAyah.teksArab,
                    options: optionsArr,
                    correctIndex: optionsArr.indexOf(nextAyah.teksArab),
                    surahName: randomSurah.namaLatin,
                    nomorAyat: pickedAyah.nomorAyat,
                    nextAyat: nextAyah.teksArab
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
            const res = await axios.get('https://equran.id/api/v2/surat');
            const surahList = res.data.data;

            const newQuestions: Question[] = [];
            for (let i = 0; i < 10; i++) {
                const q = await fetchQuestion(surahList);
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
        }
    };

    const handleAnswer = (index: number) => {
        if (isAnswered) return;

        setSelectedAnswer(index);
        setIsAnswered(true);

        if (index === questions[currentIndex].correctIndex) {
            // Scoring: Base 10 + Time bonus
            const timeBonus = Math.floor(timeLeft / 30); // Adjusted for 3 mins
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
                        onClick={() => gameState === 'selection' ? router.push('/quran') : resetGame()}
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
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                                Pilih <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Mode Game</span>
                            </h2>
                            <p className="text-slate-500 dark:text-slate-400 text-lg">Uji hafalan dan pengetahuan Al-Qur'an Anda dengan cara yang seru</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <button
                                onClick={() => setMode('tebak')}
                                className={`group p-8 rounded-3xl border-2 transition-all duration-500 text-left relative overflow-hidden ${mode === 'tebak'
                                    ? 'border-emerald-500 bg-white dark:bg-slate-900 shadow-2xl shadow-emerald-500/10'
                                    : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 hover:border-emerald-200 dark:hover:border-emerald-900/50'
                                    }`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-colors duration-500 ${mode === 'tebak' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                    <HelpCircle className="w-8 h-8" />
                                </div>
                                <h3 className={`text-xl font-bold mb-2 transition-colors duration-500 ${mode === 'tebak' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>Tebak Nama Surat</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Diberikan satu ayat penuh, tebak dari surat manakah ayat tersebut berasal.</p>
                            </button>

                            <button
                                onClick={() => setMode('lanjut')}
                                className={`group p-8 rounded-3xl border-2 transition-all duration-500 text-left relative overflow-hidden ${mode === 'lanjut'
                                    ? 'border-teal-500 bg-white dark:bg-slate-900 shadow-2xl shadow-teal-500/10'
                                    : 'border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 hover:border-teal-200 dark:hover:border-teal-900/50'
                                    }`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-700"></div>
                                <div className={`w-14 h-14 rounded-2xl mb-6 flex items-center justify-center transition-colors duration-500 ${mode === 'lanjut' ? 'bg-teal-500 text-white shadow-lg shadow-teal-500/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                    <Brain className="w-8 h-8" />
                                </div>
                                <h3 className={`text-xl font-bold mb-2 transition-colors duration-500 ${mode === 'lanjut' ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>Lanjutkan Ayat</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">Diberikan satu ayat, pilih kelanjutan ayat yang benar dari pilihan yang tersedia.</p>
                            </button>
                        </div>

                        {/* Difficulty */}
                        <div className="space-y-4 pt-4">
                            <h4 className="text-slate-900 dark:text-white font-bold text-center">Tingkat Kesulitan:</h4>
                            <div className="flex flex-wrap justify-center gap-4">
                                {(['easy', 'medium', 'hard'] as Difficulty[]).map((d) => (
                                    <button
                                        key={d}
                                        onClick={() => setDifficulty(d)}
                                        className={`px-8 py-3 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all duration-300 border-2 ${difficulty === d
                                            ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white shadow-xl rotate-1'
                                            : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-400 dark:hover:border-slate-600'
                                            }`}
                                    >
                                        {d === 'easy' ? 'Mudah' : d === 'medium' ? 'Sedang' : 'Sulit'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-center pt-8">
                            <button
                                onClick={startGame}
                                className="group relative px-12 py-5 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-3xl font-black text-white text-xl shadow-2xl shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:-translate-y-1 transition-all duration-500 flex items-center gap-3 active:scale-95"
                            >
                                <Play className="w-6 h-6 fill-current group-hover:scale-110 transition-transform" />
                                MULAI GAME
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
                    <div className="space-y-6 animate-in fade-in zoom-in duration-500">
                        {/* Status Bar */}
                        <div className="flex items-center justify-between gap-4 p-4 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-900/5">
                            <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                                <Timer className={`w-5 h-5 ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`} />
                                <span className={`font-mono font-bold text-xl ${timeLeft < 60 ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>{formatTime(timeLeft)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Soal</span>
                                    <span className="font-bold text-lg text-slate-900 dark:text-white">{currentIndex + 1} <span className="text-slate-400">/ 10</span></span>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Skor</span>
                                    <span className="font-bold text-xl text-emerald-600 dark:text-emerald-400">{score}</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Line */}
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-500 ease-out" style={{ width: `${((currentIndex + 1) / 10) * 100}%` }}></div>
                        </div>

                        {/* Question Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 md:p-12 border border-slate-200 dark:border-slate-800 shadow-2xl shadow-slate-900/10 space-y-10 relative overflow-hidden group">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

                            <div className="text-center space-y-8">
                                <p className="font-arabic text-3xl md:text-5xl text-slate-900 dark:text-white leading-[2.2] md:leading-[2.5]" dir="rtl">
                                    {questions[currentIndex].text}
                                </p>

                                {mode === 'tebak' && difficulty !== 'hard' && questions[currentIndex].translation && (
                                    <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-100 dark:border-slate-800 italic text-slate-600 dark:text-slate-400 leading-relaxed md:text-lg">
                                        "{questions[currentIndex].translation}"
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                                {questions[currentIndex].options.map((option, i) => {
                                    const isCorrect = i === questions[currentIndex].correctIndex;
                                    const isSelected = selectedAnswer === i;

                                    let style = "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 hover:border-emerald-500 dark:hover:border-emerald-500 text-slate-700 dark:text-slate-300";

                                    if (isAnswered) {
                                        if (isCorrect) style = "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 scale-[1.02]";
                                        else if (isSelected) style = "border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/30 scale-95 opacity-80";
                                        else style = "border-slate-100 dark:border-slate-900 bg-slate-100 dark:bg-slate-900 opacity-30";
                                    }

                                    return (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswer(i)}
                                            disabled={isAnswered}
                                            className={`p-6 rounded-3xl border-2 font-bold text-center transition-all duration-300 flex items-center justify-center gap-3 min-h-[4rem] ${style} ${mode === 'lanjut' ? 'font-arabic text-xl md:text-2xl py-8' : 'text-lg'}`}
                                            dir={mode === 'lanjut' ? 'rtl' : 'ltr'}
                                        >
                                            <span className="flex-grow">{option}</span>
                                            {isAnswered && isCorrect && <CheckCircle2 className="w-6 h-6 shrink-0" />}
                                            {isAnswered && !isCorrect && isSelected && <XCircle className="w-6 h-6 shrink-0" />}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <p className="text-center text-slate-400 dark:text-slate-600 text-xs font-medium uppercase tracking-[0.2em]">Pilih satu jawaban yang paling tepat</p>
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
