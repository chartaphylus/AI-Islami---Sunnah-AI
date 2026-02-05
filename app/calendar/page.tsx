"use client";

import { useState, useEffect } from 'react';

import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { fetchHijriCalendar, PrayerTimesData } from '@/lib/external-api';

interface CalendarDay extends PrayerTimesData { }

export default function CalendarPage() {
    const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    // Fallback to Jakarta if geolocation fails or is denied
                    setLocation({ lat: -6.2088, lng: 106.8456 });
                },
                { enableHighAccuracy: true }
            );
        } else {
            // Fallback for browsers that don't support geolocation
            setLocation({ lat: -6.2088, lng: 106.8456 });
        }
    }, []);

    useEffect(() => {
        if (!location) return;

        const fetchCalendar = async () => {
            setLoading(true);
            try {
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth() + 1;
                const data = await fetchHijriCalendar(year, month, location.lat, location.lng);
                setCalendarData(data);
            } catch (error) {
                console.error("Gagal mengambil data kalender", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCalendar();
    }, [currentDate, location]);

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
        <div className="min-h-screen bg-neutral-50 dark:bg-black pt-16 pb-24">
            {/* Header Sticky - Added for consistency */}
            <div className="sticky top-0 z-50 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-gray-100 dark:border-neutral-900 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="w-10"></div>

                    <div className="text-center">
                        <h1 className="font-bold text-gray-900 dark:text-white">
                            Kalender
                        </h1>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                            Hijriyah & Masehi
                        </p>
                    </div>

                    <div className="w-10"></div>
                </div>
            </div>

            <div className="px-4 max-w-5xl mx-auto pt-6">
                {/* Header & Controls */}
                <div className="flex flex-col gap-6 mb-8 animate-in fade-in slide-in-from-top-5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                            {/* Removed Title here as it is now in Header */}
                            {!location && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase tracking-wider border border-amber-100 dark:border-amber-900/30">
                                    <MapPin className="w-3 h-3" />
                                    Mendeteksi...
                                </div>
                            )}
                            {location && (
                                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-100 dark:border-emerald-900/30">
                                    <MapPin className="w-3 h-3" />
                                    Lokasi Aktif
                                </div>
                            )}
                            <div className="w-full md:w-auto mt-1 md:mt-0">
                                <p className="text-emerald-600 dark:text-emerald-500 font-medium text-sm md:text-base">
                                    {currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Prayer Times Grid - Fixed Width */}
                    {todayData && (
                        <div className="grid grid-cols-5 gap-2 px-1">
                            {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((time) => {
                                const isCurrent = prayerStatus.current === time;
                                const isNext = prayerStatus.next === time;
                                const prayerName = time === 'Fajr' ? 'Subuh' : time === 'Dhuhr' ? 'Dzuhur' : time;

                                return (
                                    <div
                                        key={time}
                                        className={`relative flex flex-col items-center justify-center py-2.5 rounded-xl border transition-all duration-300 overflow-hidden ${isCurrent
                                            ? 'bg-white dark:bg-neutral-900 border-emerald-500 shadow-lg shadow-emerald-500/10 scale-105 z-10'
                                            : isNext
                                                ? 'bg-white dark:bg-neutral-900 border-amber-200 dark:border-amber-800 ring-1 ring-amber-500/20'
                                                : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-neutral-800'
                                            }`}
                                    >
                                        {/* Status Label (Floating Top) */}
                                        {(isCurrent || isNext) && (
                                            <div className={`absolute top-0 inset-x-0 h-1 ${isCurrent ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                        )}

                                        {(isCurrent || isNext) && (
                                            <span className={`text-[8px] font-black uppercase tracking-widest mb-0.5 ${isCurrent ? 'text-emerald-500' : 'text-amber-500'}`}>
                                                {isCurrent ? 'SEKARANG' : 'NEXT'}
                                            </span>
                                        )}

                                        {/* Prayer Name */}
                                        <span className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${isCurrent || isNext ? 'text-gray-900 dark:text-white' : 'text-gray-400'}`}>
                                            {prayerName}
                                        </span>

                                        {/* Time */}
                                        <span className={`text-xs md:text-lg font-bold ${isCurrent ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-900 dark:text-white'}`}>
                                            {todayData.timings[time as keyof typeof todayData.timings].split(' ')[0]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Calendar Container */}
                <div className="bg-white dark:bg-neutral-900 rounded-[2rem] shadow-sm border border-gray-100 dark:border-neutral-800 overflow-hidden">
                    {/* Month Navigator */}
                    <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100 dark:border-neutral-800">
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
                            className="p-2 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                        </button>
                        <span className="font-bold text-gray-900 dark:text-white">
                            {currentDate.toLocaleDateString('id-ID', { month: 'long' })} <span className="text-gray-400 font-normal">{currentDate.getFullYear()}</span>
                        </span>
                        <button
                            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
                            className="p-2 hover:bg-gray-50 dark:hover:bg-neutral-800 rounded-full transition-colors"
                        >
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                        </button>
                    </div>

                    {/* Days Header */}
                    <div className="grid grid-cols-7 border-b border-gray-100 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-900 text-center py-3">
                        {['M', 'S', 'S', 'R', 'K', 'J', 'S'].map((d, i) => (
                            <div key={i} className={`text-xs font-bold ${i === 5 ? 'text-emerald-500' : 'text-gray-400'}`}>{d}</div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    {loading ? (
                        <div className="p-8 text-center text-gray-400 text-sm">Memuat data kalender...</div>
                    ) : (
                        <div className="grid grid-cols-7">
                            {[...Array(startDayIndex)].map((_, i) => (
                                <div key={`empty-${i}`} className="min-h-[85px] md:min-h-[120px] border-b border-r border-gray-100 dark:border-neutral-800/40 bg-gray-50/20 dark:bg-neutral-900/20"></div>
                            ))}

                            {calendarData.map((day, idx) => {
                                const isToday = day.date.gregorian.date === todayDateStr;
                                let displayHijriDay = day.date.hijri.day;

                                // Adjust Hijri date after Maghrib
                                if (isToday && afterMaghrib && calendarData[todayIndex + 1]) {
                                    displayHijriDay = calendarData[todayIndex + 1].date.hijri.day;
                                } else if (isToday && afterMaghrib && !calendarData[todayIndex + 1]) {
                                    displayHijriDay = (parseInt(displayHijriDay) + 1).toString();
                                }

                                return (
                                    <div
                                        key={idx}
                                        className={`min-h-[85px] md:min-h-[120px] p-2 md:p-4 flex flex-col justify-between border-b border-r border-gray-100 dark:border-neutral-800/40 transition-colors ${isToday ? 'bg-emerald-50/50 dark:bg-emerald-900/10' : 'hover:bg-gray-50/50 dark:hover:bg-neutral-800/30'
                                            }`}
                                    >
                                        <span className={`text-sm md:text-lg font-bold ${isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {day.date.gregorian.day}
                                        </span>
                                        <span className={`text-end font-arabic text-sm md:text-xl ${isToday ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-600'}`}>
                                            {displayHijriDay}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
