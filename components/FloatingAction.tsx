"use client";

import { MessagesSquare, Sparkles } from "lucide-react";
import Link from "next/link";

export default function FloatingAction() {
    return (
        <Link href="/ai" className="group fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 bg-gray-900 dark:bg-white text-white dark:text-gray-900 p-3 md:p-4 rounded-full shadow-2xl hover:scale-110 hover:rotate-3 transition-all duration-300 active:scale-95 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping opacity-75 duration-[3000ms]"></div>
            <div className="relative">
                <MessagesSquare className="w-6 h-6" />
                <div className="absolute -top-1 -right-1">
                    <Sparkles className="w-3 h-3 text-emerald-400 dark:text-emerald-600 fill-current" />
                </div>
            </div>

            {/* Tooltip */}
            <span className="absolute right-full mr-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Tanya AI
            </span>
        </Link>
    );
}
