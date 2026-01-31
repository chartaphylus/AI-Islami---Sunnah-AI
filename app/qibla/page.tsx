"use client";

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, MapPin, AlertCircle, RefreshCw } from 'lucide-react';

export default function QiblaPage() {
    const [heading, setHeading] = useState(0);
    const [qiblaDirection, setQiblaDirection] = useState(251);
    const [isCompassActive, setIsCompassActive] = useState(false);
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCalibrating, setIsCalibrating] = useState(false);

    // Kaaba Coordinates
    const KAABA_LAT = 21.422487;
    const KAABA_LNG = 39.826206;

    const calculateQibla = useCallback((lat: number, lng: number) => {
        const φ1 = lat * Math.PI / 180;
        const λ1 = lng * Math.PI / 180;
        const φ2 = KAABA_LAT * Math.PI / 180;
        const λ2 = KAABA_LNG * Math.PI / 180;

        const y = Math.sin(λ2 - λ1);
        const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(λ2 - λ1);
        let qibla = Math.atan2(y, x) * 180 / Math.PI;
        qibla = (qibla + 360) % 360;
        setQiblaDirection(qibla);
    }, []);

    const handleOrientation = (e: any) => {
        const headingValue = e.webkitCompassHeading || (360 - e.alpha);
        if (headingValue !== null && headingValue !== undefined) {
            setHeading(headingValue);
        }
    };

    const startCompass = async () => {
        setError(null);
        setIsCalibrating(true);

        // Get Location
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude, longitude } = pos.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    calculateQibla(latitude, longitude);
                    setTimeout(() => setIsCalibrating(false), 1000);
                },
                (err) => {
                    console.error("Location error:", err);
                    setError("Gagal mendapatkan lokasi. Menggunakan estimasi default.");
                    setIsCalibrating(false);
                },
                { enableHighAccuracy: true }
            );
        }

        const deviceEvent = window.DeviceOrientationEvent as any;
        if (deviceEvent && typeof deviceEvent.requestPermission === 'function') {
            try {
                const permission = await deviceEvent.requestPermission();
                if (permission === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                    setIsCompassActive(true);
                } else {
                    setError("Izin sensor ditolak. Mohon izinkan akses sensor gerak.");
                }
            } catch (err) {
                setError("Gagal meminta izin sensor. Pastikan Anda menggunakan HTTPS.");
            }
        } else {
            const win = window as any;
            if ('ondeviceorientationabsolute' in win) {
                win.addEventListener('deviceorientationabsolute', handleOrientation);
                setIsCompassActive(true);
            } else if ('ondeviceorientation' in win) {
                win.addEventListener('deviceorientation', handleOrientation);
                setIsCompassActive(true);
            } else {
                setError("Perangkat Anda tidak mendukung sensor kompas.");
            }
        }
    };

    useEffect(() => {
        return () => {
            window.removeEventListener('deviceorientation', handleOrientation);
            window.removeEventListener('deviceorientationabsolute', handleOrientation);
        };
    }, []);

    const isAligned = Math.abs((heading % 360) - qiblaDirection) < 5;

    return (
        <div className="relative min-h-screen bg-white dark:bg-neutral-950 overflow-hidden selection:bg-emerald-500/30">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[100px]" />

            <div className="relative z-10 max-w-lg mx-auto min-h-screen flex flex-col px-6 pt-20 pb-12">
                {/* Header */}
                <div className="flex flex-col items-center text-center space-y-4 mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <Link href="/calendar" className="group self-start flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-emerald-500 transition-all">
                        <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 flex items-center justify-center group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Kembali
                    </Link>

                    <div className="pt-2">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold tracking-wider uppercase transition-all duration-500 ${location ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-gray-50 dark:bg-neutral-900 border-gray-100 dark:border-neutral-800 text-gray-400'}`}>
                            <MapPin className="w-3 h-3" />
                            {location ? `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}` : "Mencari Lokasi..."}
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Arah Kiblat</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-[280px] leading-relaxed">
                        Arahkan ponsel Anda ke posisi datar untuk akurasi optimal menuju Ka'bah
                    </p>
                </div>

                {/* Compass Visualization */}
                <div className="flex-grow flex flex-col items-center justify-center py-8">
                    <div className="relative group perspective-1000">
                        {/* Glow Effect when Aligned */}
                        <div className={`absolute inset-[-40px] rounded-full blur-[60px] transition-all duration-1000 ${isAligned ? 'bg-emerald-500/20 scale-110 opacity-100' : 'bg-emerald-500/0 scale-90 opacity-0'}`} />

                        {/* Outer Ring */}
                        <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full border-[10px] border-white dark:border-neutral-900 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] bg-gray-50/30 dark:bg-neutral-900/30 backdrop-blur-xl flex items-center justify-center overflow-hidden">

                            <div className="absolute inset-0 rounded-full shadow-inner pointer-events-none" />
                            <div className="absolute inset-4 rounded-full border border-gray-100 dark:border-neutral-800 pointer-events-none" />

                            {/* Rotating Compass Card */}
                            <div
                                className="absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]"
                                style={{ transform: `rotate(${-heading}deg)` }}
                            >
                                {/* North Marking */}
                                <div className="absolute top-4 flex flex-col items-center">
                                    <span className="text-[10px] font-black text-red-500 dark:text-red-400 tracking-widest">N</span>
                                    <div className="w-1 h-3 bg-red-500/30 rounded-full mt-1" />
                                </div>

                                {/* Intermediate Markings */}
                                {[45, 90, 135, 180, 225, 270, 315].map(deg => (
                                    <div key={deg} className="absolute inset-0 flex flex-col items-center pt-4" style={{ transform: `rotate(${deg}deg)` }}>
                                        <span className="text-[10px] font-bold text-gray-300 dark:text-neutral-700">
                                            {deg === 90 ? 'E' : deg === 180 ? 'S' : deg === 270 ? 'W' : ''}
                                        </span>
                                        <div className="w-[1px] h-2 bg-gray-200 dark:bg-neutral-800 mt-1" />
                                    </div>
                                ))}

                                {/* Fine Degree Lines */}
                                {[...Array(72)].map((_, i) => (
                                    <div key={i} className="absolute inset-0 flex flex-col items-center pt-2" style={{ transform: `rotate(${i * 5}deg)` }}>
                                        <div className={`w-[1px] h-1 ${i % 9 === 0 ? 'bg-gray-400 h-2' : 'bg-gray-100 dark:bg-neutral-800'}`} />
                                    </div>
                                ))}

                                {/* Qibla Marker (Ka'bah Icon) */}
                                <div
                                    className="absolute inset-0 flex flex-col items-center pt-8"
                                    style={{ transform: `rotate(${qiblaDirection}deg)` }}
                                >
                                    <div className="flex flex-col items-center group/kiblat">
                                        <div className="relative">
                                            <div className="absolute -inset-6 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                                            <div className="relative w-12 h-12 rounded-2xl bg-emerald-600 shadow-[0_8px_16px_rgba(16,185,129,0.3)] flex items-center justify-center border-2 border-white/20">
                                                <Compass className="w-7 h-7 text-white" />
                                            </div>
                                        </div>
                                        <div className="mt-4 bg-emerald-600 text-[10px] font-black text-white px-3 py-1.5 rounded-full shadow-lg tracking-widest uppercase">KIBLAT</div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-xl border border-gray-100 dark:border-neutral-700 z-30 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-neutral-600" />
                            </div>

                            <div className="absolute top-[8%] w-1.5 h-16 bg-gradient-to-t from-red-400 to-red-600 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.4)] z-20" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-auto space-y-8 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    {error && (
                        <div className="w-full p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 backdrop-blur-md">
                            <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                            <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed font-medium">{error}</p>
                        </div>
                    )}

                    <div className="w-full grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-3xl bg-gray-50/50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800/50 backdrop-blur-md flex flex-col items-center space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Kiblat</span>
                            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{Math.round(qiblaDirection)}°</span>
                        </div>
                        <div className="p-4 rounded-3xl bg-gray-50/50 dark:bg-neutral-900/50 border border-gray-100 dark:border-neutral-800/50 backdrop-blur-md flex flex-col items-center space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Heading</span>
                            <span className="text-2xl font-black text-amber-600 dark:text-amber-500">{Math.round(heading)}°</span>
                        </div>
                    </div>

                    <button
                        onClick={startCompass}
                        className={`group relative w-full h-16 rounded-[2rem] overflow-hidden transition-all duration-300 active:scale-95 ${isCompassActive && !error ? 'cursor-default' : 'hover:shadow-2xl hover:shadow-emerald-500/20'}`}
                        disabled={isCompassActive && !error}
                    >
                        {isCompassActive && !error ? (
                            <div className="absolute inset-0 bg-gray-100 dark:bg-neutral-900 flex items-center justify-center gap-3 text-gray-500 font-bold tracking-tight">
                                <Compass className="w-6 h-6" />
                                Sensor Aktif
                            </div>
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-emerald-600 transition-transform duration-300 group-hover:scale-105" />
                                <div className="absolute inset-0 flex items-center justify-center gap-3 text-white font-black tracking-tight">
                                    {isCalibrating ? (
                                        <RefreshCw className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <Compass className="w-6 h-6 animate-bounce" />
                                    )}
                                    {isCalibrating ? 'MENGKALIBRASI...' : 'AKTIFKAN KOMPAS'}
                                </div>
                            </>
                        )}
                    </button>

                    <div className="flex flex-col items-center space-y-4">
                        <div className="h-[1px] w-12 bg-gray-100 dark:bg-neutral-800" />
                        <p className="text-center text-[10px] text-gray-400 dark:text-neutral-500 max-w-[240px] leading-relaxed uppercase tracking-tighter">
                            Untuk hasil terbaik, gerakan ponsel membentuk <strong className="text-gray-900 dark:text-white">ANGKA 8</strong> untuk kalibrasi sensor magnetik.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
