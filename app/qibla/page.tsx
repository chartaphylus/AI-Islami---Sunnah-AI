"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Compass, MapPin } from 'lucide-react';

export default function QiblaPage() {
    const [heading, setHeading] = useState(0);
    const [qiblaDirection, setQiblaDirection] = useState(295); // Approximate Qibla from Indonesia (West-Northwest)
    const [permissionGranted, setPermissionGranted] = useState(false);

    useEffect(() => {
        // Simple simulation of compass movement for visual effect if no sensor
        const interval = setInterval(() => {
            if (!permissionGranted) {
                setHeading(prev => (prev + 1) % 360);
            }
        }, 50);
        return () => clearInterval(interval);
    }, [permissionGranted]);

    return (
        <div className="min-h-screen px-4 max-w-md mx-auto pb-10 flex flex-col">
            <div className="text-center mb-8 pt-4 animate-in fade-in slide-in-from-top-5">
                <Link href="/calendar" className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-500 mb-6 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-1" /> Kembali ke Kalender
                </Link>
                <div className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
                    <MapPin className="w-5 h-5" />
                    <span className="font-medium">Lokasi Anda</span>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Arah Kiblat</h1>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                    Pastikan perangkat Anda datar untuk akurasi terbaik
                </p>
            </div>

            <div className="flex-grow flex flex-col items-center justify-center relative">
                {/* Compass Container */}
                <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full border-4 border-gray-100 dark:border-neutral-800 shadow-2xl bg-white dark:bg-neutral-900 flex items-center justify-center">

                    {/* Tick Marks */}
                    {[0, 90, 180, 270].map((deg) => (
                        <div
                            key={deg}
                            className="absolute w-full text-center text-xs font-bold text-gray-400"
                            style={{ transform: `rotate(${deg}deg)` }}
                        >
                            <span className="inline-block bg-white dark:bg-neutral-900 px-1" style={{ transform: `rotate(-${deg}deg)` }}>
                                {deg === 0 ? 'N' : deg === 90 ? 'E' : deg === 180 ? 'S' : 'W'}
                            </span>
                        </div>
                    ))}

                    {/* Rotating Compass Dial */}
                    <div
                        className="absolute w-[85%] h-[85%] rounded-full border border-gray-100 dark:border-neutral-700 transition-transform duration-500 ease-out"
                        style={{ transform: `rotate(-${heading}deg)` }}
                    >
                        {/* Static Qibla Indicator on the Dial */}
                        <div
                            className="absolute top-1/2 left-1/2 w-full h-1 bg-transparent -translate-y-1/2 -translate-x-1/2"
                            style={{ transform: `rotate(${qiblaDirection}deg)` }}
                        >
                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg animate-pulse">
                                    <Compass className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Needle (Always points UP in UI, effectively representing user's forward) 
                        Note: In a real compass app, the dial rotates so 'N' moves. 
                        Here we simulate the dial rotating against a fixed needle or vice versa.
                        Let's keep the needle fixed pointing up (User) and rotate the dial (World).
                    */}
                    <div className="absolute w-4 h-24 bg-gradient-to-t from-gray-300 to-red-500 rounded-full opacity-80 z-10" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)', top: '50%', transform: 'translateY(-100%)' }}></div>
                    <div className="absolute w-4 h-4 bg-gray-300 rounded-full z-20 shadow-md"></div>
                </div>

                <div className="mt-12 w-full">
                    <button className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center gap-2">
                        <Compass className="w-5 h-5" />
                        Kalibrasi Kompas
                    </button>
                    <p className="text-center text-xs text-gray-400 mt-4 max-w-xs mx-auto">
                        Akurasi bergantung pada sensor magnetik perangkat Anda. Jauhkan dari benda logam.
                    </p>
                </div>
            </div>
        </div>
    );
}
