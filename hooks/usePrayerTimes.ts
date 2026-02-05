"use client";

import { useState, useEffect } from 'react';
import { fetchHijriCalendar, reverseGeocode, PrayerTimesData } from '../lib/external-api';

interface CalendarDay extends PrayerTimesData { }

export function usePrayerTimes() {
    const [calendarData, setCalendarData] = useState<CalendarDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentTime, setCurrentTime] = useState(new Date());
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [cityName, setCityName] = useState<string>("Mendeteksi...");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined' && "geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    setLocation({ lat, lng });

                    // Reverse Geocoding
                    try {
                        const city = await reverseGeocode(lat, lng);
                        setCityName(city);
                    } catch (e) {
                        console.error("Geocoding failed", e);
                        setCityName("Lokasi Saya");
                    }
                },
                (err) => {
                    console.error("Error getting location:", err);
                    setLocation({ lat: -6.2088, lng: 106.8456 }); // Jakarta Fallback
                    setCityName("Jakarta");
                },
                { enableHighAccuracy: true }
            );
        } else {
            setLocation({ lat: -6.2088, lng: 106.8456 });
            setCityName("Jakarta");
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
                setError(null);
            } catch (err) {
                console.error("Gagal mengambil data kalender", err);
                setError("Gagal memuat jadwal sholat.");
            } finally {
                setLoading(false);
            }
        };

        fetchCalendar();
    }, [currentDate.getMonth(), currentDate.getFullYear(), location]);

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const todayDateStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
    const todayIndex = calendarData.findIndex(d => d.date.gregorian.date === todayDateStr);
    const todayData = calendarData[todayIndex];

    const timeToMinutes = (time: string) => {
        const cleanTime = time.split(' ')[0];
        const [h, m] = cleanTime.split(':').map(Number);
        return h * 60 + m;
    };

    const getPrayerStatus = (timings: any) => {
        if (!timings) return { current: null, next: 'Fajr', nextTime: null, diff: 0, isAfterMaghrib: false };

        const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
        const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

        let nextIndex = -1;
        for (let i = 0; i < prayers.length; i++) {
            const pMinutes = timeToMinutes(timings[prayers[i]]);
            if (pMinutes > nowMinutes) {
                nextIndex = i;
                break;
            }
        }

        let nextPrayer = nextIndex !== -1 ? prayers[nextIndex] : 'Fajr';
        let nextTimeStr = nextIndex !== -1 ? timings[nextPrayer] : (calendarData[todayIndex + 1]?.timings.Fajr || timings.Fajr);

        const nextTimeMinutes = timeToMinutes(nextTimeStr);
        let diffMinutes = nextTimeMinutes - nowMinutes;
        if (diffMinutes < 0) diffMinutes += 24 * 60;

        const currentPrayer = nextIndex > 0 ? prayers[nextIndex - 1] : (nextIndex === 0 ? 'Isha' : 'Isha');

        // Maghrib check for Hijri date adjustment
        const maghribMinutes = timeToMinutes(timings.Maghrib);
        const isAfterMaghrib = nowMinutes >= maghribMinutes;

        return { current: currentPrayer, next: nextPrayer, nextTime: nextTimeStr, diff: diffMinutes, isAfterMaghrib };
    };

    const prayerStatus = todayData ? getPrayerStatus(todayData.timings) : { current: null, next: null, nextTime: null, diff: 0, isAfterMaghrib: false };

    const getCountdown = () => {
        if (!todayData || !prayerStatus.nextTime) return "00:00:00";

        const cleanNext = prayerStatus.nextTime.split(' ')[0];
        const [nextH, nextM] = cleanNext.split(':').map(Number);

        const target = new Date(currentTime);
        target.setHours(nextH, nextM, 0, 0);

        if (target < currentTime) {
            target.setDate(target.getDate() + 1);
        }

        const diffMs = target.getTime() - currentTime.getTime();
        const h = Math.floor(diffMs / (1000 * 60 * 60));
        const m = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diffMs % (1000 * 60)) / 1000);

        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Calculate Hijri Date
    let hijriDateStr = "";
    if (todayData) {
        let hijriDay = parseInt(todayData.date.hijri.day);
        let hijriMonth = todayData.date.hijri.month.en;
        let hijriYear = todayData.date.hijri.year;

        if (prayerStatus.isAfterMaghrib) {
            hijriDay += 1;
            // Simple check for day overflow (not perfect without full calendar data, but good enough for visual)
            if (hijriDay > 30) {
                hijriDay = 1;
                // Month logic needs full library, but we'll stick to simple day increment for now or just trust next day data if available
                if (calendarData[todayIndex + 1]) {
                    hijriDay = parseInt(calendarData[todayIndex + 1].date.hijri.day);
                    hijriMonth = calendarData[todayIndex + 1].date.hijri.month.en;
                    hijriYear = calendarData[todayIndex + 1].date.hijri.year;
                }
            }
        }
        hijriDateStr = `${hijriDay} ${hijriMonth} ${hijriYear}`;
    }


    return {
        loading,
        error,
        todayData,
        currentDate,
        prayerStatus,
        location,
        cityName,
        countdown: getCountdown(),
        hijriDate: hijriDateStr,
        gregorianDate: currentDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    };
}
