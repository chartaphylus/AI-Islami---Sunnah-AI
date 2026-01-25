"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';

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

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
        return () => clearInterval(timer);
    }, []);

    const todayDateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const todayIndex = calendarData.findIndex(d => d.date.gregorian.date === todayDateStr);
    const todayData = calendarData[todayIndex];

    // Calculate start padding
    const startDayIndex = calendarData.length > 0
        ? ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(calendarData[0].date.gregorian.weekday.en)
        : 0;

    // Prayer Time Logic
    const getPrayerStatus = (timings: any) => {
        if (!timings) return { current: null, next: 'Fajr' };

        const timeToMinutes = (time: string) => {
            const [h, m] = time.split(':')[0].split(':').map(Number);
            return h * 60 + m;
        };

        const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

        let current = null;
        let next = 'Fajr';

        for (let i = 0; i < prayers.length; i++) {
            const pTime = timeToMinutes(timings[prayers[i]]);
            if (nowMinutes >= pTime) {
                current = prayers[i];
                next = prayers[(i + 1) % 5];
            }
        }

        // Handle case before Fajr
        const fajrTime = timeToMinutes(timings['Fajr']);
        if (nowMinutes < fajrTime) {
            current = 'Isha'; // Previous day's Isha technically, but for display "Next" is Fajr
            next = 'Fajr';
        }

        return { current, next };
    };

    const prayerStatus = todayData ? getPrayerStatus(todayData.timings) : { current: null, next: null };

    // Hijri Logic: If after Maghrib, use next day's Hijri date
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
        <div className="min-h-screen px-4 max-w-6xl mx-auto pb-10">
            {/* Prayer Times Header */}
            {/* Prayer Times Header */}
            {todayData && (
                <div className="mb-8 grid grid-cols-5 gap-1.5 md:gap-3 bg-white dark:bg-neutral-900 p-2 md:p-4 rounded-xl md:rounded-2xl border border-gray-100 dark:border-neutral-800 shadow-sm animate-in slide-in-from-top-3">
                    {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((time) => {
                        const isCurrent = prayerStatus.current === time;
                        const isNext = prayerStatus.next === time;

                        return (
                            <div key={time} className={`relative text-center p-1.5 md:p-3 rounded-lg md:rounded-xl border transition-all duration-300 ${isCurrent
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-500/20'
                                : isNext
                                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 ring-1 ring-emerald-500/30'
                                    : 'bg-white dark:bg-neutral-800 border-gray-100 dark:border-neutral-700'
                                }`}>
                                {isNext && (
                                    <span className="absolute -top-1.5 md:-top-2 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-[7px] md:text-[9px] font-bold px-1.5 md:px-2 py-px md:py-0.5 rounded-full shadow-sm whitespace-nowrap z-10">
                                        SELANJUTNYA
                                    </span>
                                )}
                                {isCurrent && (
                                    <span className="absolute -top-1.5 md:-top-2 left-1/2 -translate-x-1/2 bg-white text-emerald-700 text-[7px] md:text-[9px] font-bold px-1.5 md:px-2 py-px md:py-0.5 rounded-full shadow-sm animate-pulse whitespace-nowrap z-10">
                                        SEKARANG
                                    </span>
                                )}
                                <div className={`text-[9px] md:text-xs font-medium uppercase tracking-wider mb-0.5 md:mb-1 truncate ${isCurrent ? 'text-emerald-100' : 'text-emerald-800 dark:text-emerald-400'}`}>
                                    {time === 'Fajr' ? 'Subuh' : time === 'Dhuhr' ? 'Dzuhur' : time}
                                </div>
                                <div className={`text-sm md:text-xl font-bold leading-tight ${isCurrent ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                                    {todayData.timings[time as keyof typeof todayData.timings].split(' ')[0]}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Calendar Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 animate-in fade-in slide-in-from-top-5">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Kalender Hijriyah</h1>
                    <p className="text-gray-500 dark:text-gray-400 capitalize">
                        {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-center">
                    <a href="/qibla" className="flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl font-medium hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        <span>Arah Kiblat</span>
                    </a>

                    <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 p-1.5 rounded-2xl border border-gray-200 dark:border-neutral-800 shadow-sm">
                        <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <span className="w-32 text-center font-semibold text-gray-900 dark:text-gray-100">
                            {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                        </span>
                        <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-xl transition-colors">
                            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-7 gap-1 animate-pulse">
                    {[...Array(35)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 dark:bg-neutral-800 rounded-lg"></div>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-xl shadow-gray-200/50 dark:shadow-none border border-gray-200 dark:border-neutral-800 overflow-hidden animate-in fade-in zoom-in duration-500">
                    <div className="grid grid-cols-7 border-b border-gray-200 dark:border-neutral-800 bg-gray-50 dark:bg-neutral-900 text-center py-4">
                        {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                            <div key={d} className="text-xs md:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 bg-gray-200 dark:bg-neutral-800 gap-[1px]">
                        {[...Array(startDayIndex)].map((_, i) => (
                            <div key={`empty-${i}`} className="min-h-[120px] bg-gray-50/50 dark:bg-neutral-900/50"></div>
                        ))}

                        {calendarData.map((day, idx) => {
                            const isToday = day.date.gregorian.date === todayDateStr;

                            // Adjust Hijri date logic for Today if after Maghrib
                            let displayHijriDay = day.date.hijri.day;
                            let displayHijriMonth = day.date.hijri.month.en;

                            // If it's today and after Maghrib, try to get next day's Hijri date
                            if (isToday && afterMaghrib && calendarData[todayIndex + 1]) {
                                displayHijriDay = calendarData[todayIndex + 1].date.hijri.day;
                                displayHijriMonth = calendarData[todayIndex + 1].date.hijri.month.en;
                            } else if (isToday && afterMaghrib && !calendarData[todayIndex + 1]) {
                                // End of month edge case (simplified: just add 1 mathematically or show +1)
                                displayHijriDay = (parseInt(displayHijriDay) + 1).toString();
                            }

                            return (
                                <div key={idx} className={`min-h-[120px] p-3 relative hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors group flex flex-col justify-between ${isToday ? 'bg-white dark:bg-black ring-inset ring-2 ring-emerald-500/20 z-10' : 'bg-white dark:bg-neutral-900'}`}>
                                    <div className="flex justify-between items-start">
                                        <span className={`text-lg font-bold leading-none ${isToday ? 'text-white bg-emerald-500 w-8 h-8 flex items-center justify-center rounded-lg shadow-lg shadow-emerald-500/30' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {day.date.gregorian.day}
                                        </span>
                                        {isToday && <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded uppercase">Hari Ini</span>}
                                    </div>

                                    <div className="mt-2 text-right">
                                        <div className={`text-xl font-arabic leading-none mb-1 ${isToday ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-800 dark:text-gray-200 font-normal'}`} dir="rtl">
                                            {displayHijriDay}
                                        </div>
                                        <div className="text-[10px] text-gray-400 uppercase tracking-tighter">
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

