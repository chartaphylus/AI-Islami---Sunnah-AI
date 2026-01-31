"use client";

import { useState, useEffect } from 'react';
import { X, Share, PlusSquare } from 'lucide-react';

export default function InstallPrompt() {
    const [showPrompt, setShowPrompt] = useState(false);
    const [isIOS, setIsIOS] = useState(false);

    useEffect(() => {
        // Detect iOS
        const userAgent = window.navigator.userAgent.toLowerCase();
        const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
        setIsIOS(isIosDevice);

        // Check if already installed
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone;

        // Show prompt if mobile and not installed
        if (window.innerWidth < 768 && !isStandalone) {
            // Delay to not be annoying immediately
            const timer = setTimeout(() => setShowPrompt(true), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    if (!showPrompt) return null;

    return (
        <div className="fixed bottom-24 md:bottom-4 left-4 right-4 z-50 animate-in slide-in-from-bottom-5 duration-500">
            <div className="bg-white dark:bg-neutral-900 border border-emerald-100 dark:border-emerald-900 rounded-2xl shadow-2xl p-4 flex flex-col gap-3 relative">
                <button
                    onClick={() => setShowPrompt(false)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-[#00897b] rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg">
                        S
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">Install Salaf.AI</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Akses lebih cepat & tanpa internet browsing bar.</p>
                    </div>
                </div>

                {isIOS ? (
                    <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-neutral-800 p-3 rounded-xl border border-gray-100 dark:border-neutral-700">
                        <div className="flex items-center gap-2 mb-1">
                            <span>1. Klik tombol</span>
                            <Share className="w-4 h-4 text-blue-500" />
                            <span>Share di bawah</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span>2. Pilih</span>
                            <span className="font-semibold flex items-center gap-1 bg-gray-200 dark:bg-neutral-700 px-1.5 py-0.5 rounded text-xs">
                                <PlusSquare className="w-3 h-3" />
                                Add to Home Screen
                            </span>
                        </div>
                    </div>
                ) : (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        Tap menu browser & pilih "Install App" atau "Add to Home Screen".
                    </p>
                )}
            </div>
        </div>
    );
}
