"use client";

import { Compass, Map, Calendar, Calculator, BookA, Newspaper } from "lucide-react";
// Force rebuild
import Link from "next/link";

const features = [
    {
        name: "Arah Qiblat",
        icon: Compass,
        color: "text-emerald-500",
        bg: "bg-emerald-50 dark:bg-emerald-900/10",
        href: "/qibla"
    },
    {
        name: "Peta Sejarah",
        icon: Map,
        color: "text-blue-500",
        bg: "bg-blue-50 dark:bg-blue-900/10",
        href: "/peta"
    },
    {
        name: "Waris & Zakat",
        icon: Calculator,
        color: "text-amber-500",
        bg: "bg-amber-50 dark:bg-amber-900/10",
        href: "/hadits/calculator"
    },
    {
        name: "Mufrodat",
        icon: BookA,
        color: "text-purple-500",
        bg: "bg-purple-50 dark:bg-purple-900/10",
        href: "/mufradat"
    },
    {
        name: "Artikel",
        icon: Newspaper,
        color: "text-rose-500",
        bg: "bg-rose-50 dark:bg-rose-900/10",
        href: "/articles"
    }
];

export default function FeatureGrid() {
    return (
        <div className="grid grid-cols-5 gap-2 md:grid-cols-5 md:gap-4 md:flex-nowrap">
            {features.map((feature) => (
                <Link
                    key={feature.name}
                    href={feature.href}
                    className="group relative flex flex-col items-center justify-center p-1.5 md:p-4 bg-white dark:bg-neutral-900 rounded-xl md:rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-md hover:border-emerald-500/20 transition-all active:scale-95 active:border-emerald-500"
                >
                    <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center mb-1.5 md:mb-3 ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-4 h-4 md:w-6 md:h-6" />
                    </div>
                    <span className="text-[9px] md:text-xs font-bold text-gray-700 dark:text-gray-300 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-center leading-tight line-clamp-2 w-full">
                        {feature.name}
                    </span>
                </Link>
            ))}
        </div>
    );
}
