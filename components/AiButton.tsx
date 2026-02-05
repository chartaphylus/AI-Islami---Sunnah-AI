"use client";

import { useRouter } from "next/navigation";
import { Bot } from "lucide-react";

interface AiButtonProps {
    eraId: number;
}

export default function AiButton({ eraId }: AiButtonProps) {
    const router = useRouter();

    const handleAskAI = () => {
        router.push(`/ai?era_id=${eraId}`);
    };

    return (
        <button
            onClick={handleAskAI}
            className="flex items-center gap-2 mt-4 w-full justify-center px-4 py-3 bg-gradient-to-r from-cyan-900 to-blue-900 border border-cyan-500 rounded-lg text-cyan-100 hover:text-white hover:shadow-[0_0_15px_rgba(0,243,255,0.5)] transition-all duration-300 group font-cyberpunk uppercase tracking-widest text-sm"
        >
            <Bot className="w-5 h-5 text-cyan-400 group-hover:text-white transition-colors" />
            <span>Tanya AI tentang Era Ini</span>
        </button>
    );
}
