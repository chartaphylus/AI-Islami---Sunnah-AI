"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, MapPin, AlertCircle, RefreshCw, Navigation, ShieldCheck } from 'lucide-react';

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
                    setTimeout(() => setIsCalibrating(false), 1200);
                },
                (err) => {
                    console.error("Location error:", err);
                    setError("Gagal mendapatkan lokasi. Menggunakan estimasi.");
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

    const isAligned = Math.abs(((heading + 360) % 360) - qiblaDirection) < 5;

    return (
        <div className="relative min-h-screen bg-neutral-50 dark:bg-black transition-colors duration-700 overflow-hidden selection:bg-emerald-500/30">
            {/* Subtle Gradients */}
            <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-emerald-600/10 dark:bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 max-w-lg mx-auto min-h-screen flex flex-col px-5 pt-24 pb-10">
                {/* Compact Header */}
                <div className="flex flex-col items-center text-center space-y-4 mb-6">
                    <div className="w-full flex justify-between items-center px-1">
                        <Link href="/" className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-emerald-600 transition-all">
                            <div className="w-8 h-8 rounded-xl bg-white dark:bg-neutral-900 border border-gray-100 dark:border-white/5 flex items-center justify-center shadow-sm">
                                <ArrowLeft className="w-4 h-4" />
                            </div>
                        </Link>

                        <div className={`flex items-center gap-2 px-3 py-1 rounded-xl border text-[8px] font-black tracking-widest uppercase transition-all duration-700 ${location ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-white dark:bg-neutral-900 border-gray-100 dark:border-white/5 text-gray-400'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${location ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-neutral-700'}`} />
                            {location ? `${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}` : "MENUNGGU LOKASI..."}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                            Arah <span className="text-emerald-600">Kiblat</span>
                        </h1>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 max-w-[220px] mx-auto leading-relaxed font-bold uppercase tracking-tight">
                            Arahkan ponsel datar untuk akurasi optimal.
                        </p>
                    </div>
                </div>

                {/* Scaled Down Compass */}
                <div className="flex-grow flex flex-col items-center justify-center py-2">
                    <div className="relative perspective-1000">
                        {/* Glow Effect */}
                        <div className={`absolute inset-[-20px] rounded-full blur-[60px] transition-all duration-1000 ${isAligned && isCompassActive ? 'bg-emerald-500/25 scale-105 opacity-100' : 'bg-emerald-500/5 scale-90 opacity-40'}`} />

                        {/* Dial Plate - Slightly smaller (w-64) */}
                        <div className="relative w-64 h-64 rounded-full border-[1px] border-gray-200 dark:border-white/10 shadow-2xl bg-white dark:bg-neutral-900 flex items-center justify-center overflow-hidden">

                            {/* Inner Markings */}
                            <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-40">
                                {[...Array(36)].map((_, i) => (
                                    <div key={i} className="absolute inset-0 flex justify-center py-1.5" style={{ transform: `rotate(${i * 10}deg)` }}>
                                        <div className={`w-[1px] ${i % 3 === 0 ? 'h-3 bg-gray-400 dark:bg-white' : 'h-1.5 bg-gray-300 dark:bg-neutral-800'}`} />
                                    </div>
                                ))}
                            </div>

                            {/* Rotating Inner Core */}
                            <div
                                className="absolute inset-0 w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
                                style={{ transform: `rotate(${-heading}deg)` }}
                            >
                                {/* North Needle */}
                                <div className="absolute inset-0 flex flex-col items-center pt-6">
                                    <div className="w-1 h-12 bg-gradient-to-t from-red-400 to-red-600 rounded-full" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
                                    <span className="mt-1 text-[9px] font-black text-red-600 tracking-widest">N</span>
                                </div>

                                {/* Intermediate Markers */}
                                {[90, 180, 270].map(deg => (
                                    <div key={deg} className="absolute inset-0 flex flex-col items-center pt-6" style={{ transform: `rotate(${deg}deg)` }}>
                                        <span className="text-[8px] font-black text-gray-300 dark:text-neutral-800 uppercase tracking-tighter">
                                            {deg === 90 ? 'E' : deg === 180 ? 'S' : 'W'}
                                        </span>
                                    </div>
                                ))}

                                {/* Slim Qibla Marker */}
                                <div
                                    className="absolute inset-0 flex flex-col items-center pt-6"
                                    style={{ transform: `rotate(${qiblaDirection}deg)` }}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className="relative mt-2">
                                            <div className="absolute -inset-6 bg-emerald-500/20 rounded-full blur-xl animate-pulse" />
                                            <div className={`relative w-12 h-12 rounded-2xl bg-emerald-600 shadow-lg flex items-center justify-center border-2 border-white/20 transition-transform ${isAligned ? 'scale-110' : 'scale-100'}`}>
                                                <Navigation className="w-6 h-6 text-white rotate-45" />
                                            </div>
                                        </div>
                                        <div className={`mt-4 transition-all ${isAligned ? 'scale-100' : 'scale-90 opacity-60'}`}>
                                            <div className="bg-emerald-600 text-[8px] font-black text-white px-3 py-1.5 rounded-xl shadow-lg tracking-widest uppercase">KIBLAT</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Center Pin */}
                            <div className="relative w-10 h-10 rounded-full bg-white dark:bg-neutral-800 shadow-xl border border-gray-100 dark:border-white/10 z-50 flex items-center justify-center backdrop-blur-md">
                                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Compact Info Section */}
                <div className="mt-auto space-y-4 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    {error && (
                        <div className="w-full p-3 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 flex items-center gap-3">
                            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                            <p className="text-[10px] text-red-700 dark:text-red-300 font-bold tracking-tight">{error}</p>
                        </div>
                    )}

                    {/* Stats - More Compact */}
                    <div className="w-full grid grid-cols-2 gap-3">
                        <div className={`p-3 rounded-2xl border transition-all duration-500 flex flex-col items-center ${isAligned ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-white/50 dark:bg-neutral-900/50 border-gray-100 dark:border-white/5 backdrop-blur-xl'}`}>
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                <Navigation className="w-2.5 h-2.5 text-emerald-500" />
                                KIBLAT
                            </span>
                            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tighter">
                                {Math.round(qiblaDirection)}°
                            </span>
                        </div>
                        <div className="p-3 rounded-2xl bg-white/50 dark:bg-neutral-900/50 border border-gray-100 dark:border-white/5 backdrop-blur-xl flex flex-col items-center">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                <Compass className="w-2.5 h-2.5 text-amber-500" />
                                HEADING
                            </span>
                            <span className={`text-xl font-black transition-colors duration-500 tracking-tighter ${isAligned ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {Math.round(heading)}°
                            </span>
                        </div>
                    </div>

                    {/* Slim Button (h-14) */}
                    <button
                        onClick={startCompass}
                        className={`group relative w-full h-14 rounded-2xl overflow-hidden transition-all duration-300 active:scale-95 shadow-lg ${isCompassActive && !error ? 'cursor-default' : 'hover:shadow-xl hover:shadow-emerald-500/20'}`}
                        disabled={isCompassActive && !error}
                    >
                        {isCompassActive && !error ? (
                            <div className="absolute inset-0 bg-white dark:bg-neutral-900 border border-emerald-500/20 flex items-center justify-center gap-2 text-emerald-600 text-[10px] font-black tracking-[0.2em] uppercase">
                                <ShieldCheck className="w-4 h-4" />
                                SENSOR AKTIF
                            </div>
                        ) : (
                            <>
                                <div className="absolute inset-0 bg-emerald-600 transition-transform group-hover:bg-emerald-500" />
                                <div className="absolute inset-0 flex items-center justify-center gap-2 text-white font-black uppercase text-[11px] tracking-widest">
                                    {isCalibrating ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Compass className="w-4 h-4" />
                                    )}
                                    {isCalibrating ? 'KALIBRASI...' : 'AKTIFKAN KOMPAS'}
                                </div>
                            </>
                        )}
                    </button>

                    {/* Mobile Instruction */}
                    <div className="flex flex-col items-center space-y-1 pt-1 opacity-60">
                        <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Saran Akurasi</span>
                        <p className="text-[9px] text-gray-400 text-center uppercase font-bold tracking-tight">
                            Gerakkan ponsel membentuk <strong className="text-gray-900 dark:text-white">Angka 8</strong>
                        </p>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .perspective-1000 { perspective: 1000px; }
            `}</style>
        </div>
    );
}
