"use client";

import SearchUI from "@/components/SearchUI";
import { Bot } from "lucide-react";

export default function AIPage() {
    return (
        <div className="min-h-screen pt-20 pb-10 px-4 md:px-0 bg-white dark:bg-black">
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-4 animate-in fade-in slide-in-from-top-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20 mb-2">
                        <Bot className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                        Haditha AI
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        Tanyakan apa saja tentang hukum Islam, tafsir, atau hadits. Kami akan mencarikan jawaban dari sumber terpercaya.
                    </p>
                </div>

                {/* Search / Chat Interface */}
                <div className="animate-in fade-in slide-in-from-bottom-8 duration-500 delay-100">
                    <SearchUI />
                </div>
            </div>
        </div>
    );
}
