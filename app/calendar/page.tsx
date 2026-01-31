"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

interface CalendarDay {
    date: {
        gregorian: { date: string; day: string; weekday: { en: string } };
        hijri: { date: string; month: { ar: string; en: string }; year: string; day: string };
    };
    timings: { Fajr: string; Maghrib: string; Dhuhr: string; Asr: string; Isha: string };
}

export default function CalendarPage() {
    const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                const res = await axios.get(`https://api.aladhan.com/v1/calendarByCity/${year}/${month}?city=Jakarta&country=Indonesia&method=20`);
                setCalendarData(res.data.data);
            } catch (error) {
                console.error("Gagal mengambil data kalender", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCalendar();
    }, [currentDate]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const todayDateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const todayIndex = calendarData.findIndex(d => d.date.gregorian.date === todayDateStr);
    const todayData = calendarData[todayIndex];

    const startDayIndex = calendarData.length > 0
        ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(calendarData[0].date.gregorian.weekday.en)
        : 0;

    const timeToMinutes = (time: string) => {
        const cleanTime = time.split(' ')[0];
        const [h, m] = cleanTime.split(':').map(Number);
        return h * 60 + m;
    };

    const getPrayerStatus = (timings: any) => {
        if (!timings) return { current: null, next: 'Fajr' };

        const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

        let currentIndex = -1;
        for (let i = 0; i < prayers.length; i++) {
            const pMinutes = timeToMinutes(timings[prayers[i]]);
            if (nowMinutes >= pMinutes) {
                currentIndex = i;
            }
        }

        const current = currentIndex === -1 ? 'Isha' : prayers[currentIndex];
        const next = prayers[(currentIndex + 1) % 5];
        return { current, next };
    };

    const prayerStatus = todayData ? getPrayerStatus(todayData.timings) : { current: null, next: null };

    const isAfterMaghrib = () => {
        if (!todayData) return false;
        const maghribTime = todayData.timings.Maghrib.split(' ')[0];
        const [h, m] = maghribTime.split(':').map(Number);
        const maghribDate = new Date(currentTime);
        maghribDate.setHours(h, m, 0);
        return currentTime > maghribDate;
    };

    const afterMaghrib = isAfterMaghrib();

    return (
        <div className="min-h-screen px-4 max-w-6xl mx-auto pb-10 pt-20 md:pt-24">
            {/* Prayer Times Header */}
            {todayData && (
                <div className="mb-10">
                    <div className="grid grid-cols-5 gap-1 md:gap-4 animate-in slide-in-from-top-3 duration-700">
                        {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((time) => {
                            const isCurrent = prayerStatus.current === time;
                            const isNext = prayerStatus.next === time;

                            return (
                                <div
                                    key={time}
                                    className={`relative flex flex-col items-center p-2 md:p-5 rounded-xl md:rounded-2xl border transition-all duration-300 ${isCurrent
                                        ? 'bg-white dark:bg-neutral-900 border-emerald-500 shadow-md shadow-emerald-500/10 z-10'
                                        : isNext
                                            ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 shadow-sm'
                                            : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800'
                                        }`}
                                >
                                    <div className={`text-[7px] md:text-[10px] font-bold uppercase tracking-widest mb-1 ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                                        {time === 'Fajr' ? 'Subuh' : time === 'Dhuhr' ? 'Dzuhur' : time}
                                    </div>

                                    <div className={`text-xs md:text-2xl font-bold font-sans tracking-tight mb-1.5 md:mb-2 ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                                        {todayData.timings[time as keyof typeof todayData.timings].split(' ')[0]}
                                    </div>

                                    {isCurrent ? (
                                        <div className="flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2 py-0.5 bg-emerald-500 text-white rounded-full transition-transform duration-500 scale-105">
                                            <div className="w-1 h-1 rounded-full bg-white animate-pulse" />
                                            <span className="text-[6px] md:text-[8px] font-bold uppercase tracking-tighter">Sekarang</span>
                                        </div>
                                    ) : isNext ? (
                                        <div className="flex items-center gap-1 md:gap-1.5 px-1.5 md:px-2 py-0.5 bg-amber-500 text-white rounded-full">
                                            <span className="text-[6px] md:text-[8px] font-bold uppercase tracking-tighter">Next</span>
                                        </div>
                                    ) : (
                                        <div className="h-3 md:h-4" />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Calendar Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 animate-in fade-in slide-in-from-top-5">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Kalender Hijriyah</h1>
                    <div className="text-gray-500 dark:text-gray-400 capitalize font-medium flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                        {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-center">
                    <Link href="/qibla" className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        <span>Arah Kiblat</span>
                    </Link>

                    <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 p-1.5 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm">
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <span className="w-32 text-center font-bold text-gray-900 dark:text-gray-100 text-sm">
                            {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-7 gap-1 animate-pulse">
                    {[...Array(35)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 dark:bg-neutral-800 rounded-2xl"></div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-100 dark:border-neutral-800 overflow-hidden animate-in fade-in zoom-in duration-500">
                    <div className="grid grid-cols-7 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-950/50 text-center py-5">
                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                            <div key={d} className="text-[10px] md:text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-0">
                        {[...Array(startDayIndex)].map((_, i) => (
                            <div key={`empty-${i}`} className="min-h-[100px] md:min-h-[140px] bg-gray-50/20 dark:bg-neutral-950/20 border-b border-r border-gray-100 dark:border-neutral-800/10"></div>
                        ))}

                        {calendarData.map((day, idx) => {
                            const isToday = day.date.gregorian.date === todayDateStr;

                            let displayHijriDay = day.date.hijri.day;
                            let displayHijriMonth = day.date.hijri.month.en;

                            if (isToday && afterMaghrib && calendarData[todayIndex + 1]) {
                                displayHijriDay = calendarData[todayIndex + 1].date.hijri.day;
                                displayHijriMonth = calendarData[todayIndex + 1].date.hijri.month.en;
                            } else if (isToday && afterMaghrib && !calendarData[todayIndex + 1]) {
                                displayHijriDay = (parseInt(displayHijriDay) + 1).toString();
                            }

                            return (
                                <div key={idx} className={`min-h-[100px] md:min-h-[140px] p-3 md:p-5 relative hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-all duration-300 group flex flex-col justify-between border-b border-r border-gray-100 dark:border-neutral-800/20 ${isToday ? 'bg-emerald-50/20 dark:bg-emerald-900/10 z-10' : 'bg-white dark:bg-neutral-900'}`}>
                                    <div className="flex justify-between items-start">
                                        <span className={`text-lg md:text-xl font-black leading-none ${isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-gray-200'}`}>
                                            {day.date.gregorian.day}
                                        </span>
                                        {isToday && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                                        )}
                                    </div>

                                    <div className="mt-2 text-right">
                                        <div className={`text-xl md:text-2xl font-arabic leading-none mb-1 ${isToday ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-400 dark:text-neutral-600 font-normal'}`} dir="rtl">
                                            {displayHijriDay}
                                        </div>
                                        <div className="text-[8px] md:text-[10px] text-gray-400 dark:text-neutral-600 uppercase font-black tracking-tighter">
                                            {displayHijriMonth.substring(0, 3)}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
