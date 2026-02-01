"use client";

import { useTheme } from "next-themes";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Home, BookOpen, Heart, Calendar, Book } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => setMounted(true), []);

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Al-Qur\'an', path: '/quran', icon: BookOpen },
        { name: 'Hadits', path: '/hadits', icon: Book },
        { name: 'Doa', path: '/doa', icon: Heart },
        { name: 'Calendar', path: '/calendar', icon: Calendar },
    ];

    if (!mounted) return null;

    return (
        <nav className="fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/10 dark:border-white/5">
            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-md"></div>
            <div className="max-w-5xl mx-auto px-4 h-16 relative flex items-center justify-between">

                <Link href="/" className="group flex items-center gap-3 relative z-10" onClick={() => setIsOpen(false)}>
                    <div className="relative w-10 h-10 md:w-11 md:h-11 rounded-xl overflow-hidden shadow-lg shadow-emerald-500/10 group-hover:scale-105 transition-all duration-300">
                        <img
                            src="/logo.png"
                            alt="Salaf.AI Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                        Salaf<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">.AI</span>
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-1 bg-gray-100/50 dark:bg-neutral-800/50 p-1.5 rounded-full border border-gray-200/50 dark:border-white/5 backdrop-blur-sm relative z-10">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${isActive
                                    ? 'bg-white dark:bg-neutral-900 text-emerald-700 dark:text-emerald-400 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-white/50 dark:hover:bg-white/5'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 relative z-10">
                    <button
                        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
                        className="p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-400 transition-all active:scale-90"
                        aria-label="Toggle Theme"
                    >
                        {resolvedTheme === 'dark' ? <Sun className="w-5 h-5 md:w-4 md:h-4" /> : <Moon className="w-5 h-5 md:w-4 md:h-4" />}
                    </button>
                </div>
            </div>

            {/* Bottom Navigation (Mobile Only) */}
            <div className="md:hidden fixed bottom-0 left-0 w-full z-50 transition-all duration-300">
                <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-t border-gray-100 dark:border-white/5"></div>
                <div className="relative flex items-center justify-around h-20 px-6 pb-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path || (item.path !== '/' && pathname?.startsWith(item.path));
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.path}
                                href={item.path}
                                className={`flex flex-col items-center justify-center gap-1.5 transition-all duration-300 relative ${isActive
                                    ? 'text-emerald-600 dark:text-emerald-400 scale-110'
                                    : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                                    }`}
                            >
                                {isActive && (
                                    <div className="absolute -top-3 w-8 h-1 bg-emerald-500 rounded-full blur-[2px] animate-in fade-in zoom-in duration-500"></div>
                                )}
                                <Icon className={`w-6 h-6 ${isActive ? 'fill-current/10' : ''}`} />
                                <span className={`text-[10px] font-bold tracking-tight uppercase ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
