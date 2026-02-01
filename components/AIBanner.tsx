"use client";

import { Bot, MessageSquare } from "lucide-react";
import Link from "next/link";

export default function AIBanner() {
    return (
        <div className="relative overflow-hidden bg-gray-900 dark:bg-black rounded-2xl md:rounded-[2rem] p-4 md:p-10 shadow-2xl border border-gray-800">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 text-center md:text-left">
                <div className="space-y-2 md:space-y-4 max-w-lg">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
                        <Bot className="w-3 h-3" /> AI Assistant
                    </div>
                    <h2 className="text-lg md:text-3xl font-bold text-white leading-tight">
                        Bingung mencari dalil? <span className="text-emerald-400">Tanya Haditha AI sekarang.</span>
                    </h2>
                    <p className="text-xs md:text-lg text-gray-400 leading-relaxed max-w-md mx-auto md:mx-0">
                        Dapatkan jawaban akurat dari referensi yang terpercaya.
                    </p>
                </div>

                <Link
                    href="/ai"
                    className="group relative inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-5 md:py-4 md:px-8 rounded-xl transition-all shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/50 hover:-translate-y-1"
                >
                    <MessageSquare className="w-4 h-4 md:w-5 md:h-5 group-hover:scale-110 transition-transform" />
                    <span className="text-sm md:text-lg">Mulai Chat</span>
                </Link>
            </div>
        </div>);
}
