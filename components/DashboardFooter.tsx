"use client";

import { Info } from "lucide-react";
import Link from "next/link";

export default function DashboardFooter() {


    return (
        <footer className="mt-8 mb-0 md:mb-8 text-center space-y-3">
            <Link
                href="/about"
                className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-white/5 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-xs font-medium text-gray-600 dark:text-gray-300 rounded-full transition-all active:scale-95"
            >
                <Info className="w-3.5 h-3.5" />
                <span>Tentang Aplikasi</span>
            </Link>

            <p className="text-[10px] font-mono text-gray-400 dark:text-gray-600">
                v.1.0.2 - Salafy Tech
            </p>


        </footer>
    );
}
