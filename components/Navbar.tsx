"use client";

import { useTheme } from "next-themes";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Moon, Sun, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => setMounted(true), []);

    const navItems = [
        { name: 'Home', path: '/' },
        { name: "Al-Qur'an", path: '/quran' },
        { name: 'Kalender', path: '/calendar' },
    ];

    if (!mounted) return null;

    return (
        <nav className="fixed top-0 w-full z-50 transition-all duration-300 border-b border-white/10 dark:border-white/5">
            <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-md"></div>
            <div className="max-w-5xl mx-auto px-4 h-16 relative flex items-center justify-between">

                {/* Logo */}
                <Link href="/" className="group flex items-center gap-2 relative z-10" onClick={() => setIsOpen(false)}>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white font-amiri font-bold text-2xl shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300 border border-emerald-400/20">
                        S
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
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-400 transition-colors"
                        aria-label="Toggle Theme"
                    >
                        {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-500 dark:text-gray-400"
                    >
                        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-neutral-950 border-b border-gray-100 dark:border-neutral-800 shadow-xl animate-in slide-in-from-top-5 duration-200">
                    <div className="flex flex-col p-4 space-y-2">
                        {navItems.map((item) => {
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    href={item.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`px-4 py-3 rounded-xl text-base font-medium transition-colors ${isActive
                                        ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400'
                                        : 'text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}
        </nav>
    );
}
