"use client";

import { BookOpen, Search, Sparkles } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-black pt-16">
            {/* Hero Skeleton (Matches page.tsx layout) */}
            <div className="relative overflow-hidden pt-6 pb-8 md:pt-12 md:pb-20 border-b border-gray-100 dark:border-neutral-800">
                <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-gray-100/50 to-transparent dark:from-neutral-800/20 pointer-events-none"></div>

                <div className="relative max-w-5xl mx-auto px-4 text-center space-y-3 md:space-y-6 animate-pulse">

                    {/* Badge Skeleton */}
                    <div className="flex justify-center">
                        <div className="h-6 w-32 bg-gray-200 dark:bg-neutral-800 rounded-full"></div>
                    </div>

                    {/* Title Skeleton */}
                    <div className="h-8 md:h-12 w-3/4 md:w-1/2 mx-auto bg-gray-200 dark:bg-neutral-800 rounded-2xl"></div>

                    {/* Description Skeleton */}
                    <div className="space-y-2 max-w-xl mx-auto">
                        <div className="h-4 w-full bg-gray-100 dark:bg-neutral-900 rounded-lg"></div>
                        <div className="h-4 w-2/3 mx-auto bg-gray-100 dark:bg-neutral-900 rounded-lg"></div>
                    </div>

                    {/* Search & Filter Skeleton */}
                    <div className="max-w-2xl mx-auto space-y-2 pt-4">
                        <div className="h-12 w-full bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-2xl"></div>
                        <div className="flex gap-2">
                            <div className="flex-1 h-10 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg"></div>
                            <div className="flex-1 h-10 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Skeleton */}
            <div className="max-w-7xl mx-auto px-4 pb-20 pt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[...Array(9)].map((_, i) => (
                        <div
                            key={i}
                            className="h-40 bg-white dark:bg-neutral-900/50 rounded-[2rem] border border-gray-200 dark:border-neutral-800 p-4 relative overflow-hidden group"
                        >
                            {/* Shimmer Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 dark:via-neutral-800/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>

                            <div className="flex items-center gap-3 relative z-10">
                                {/* Icon Circle */}
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 shrink-0"></div>

                                <div className="flex-1 space-y-2">
                                    {/* Title Line */}
                                    <div className="h-5 w-3/4 bg-gray-200 dark:bg-neutral-800 rounded-md"></div>
                                    {/* Tag Line */}
                                    <div className="h-3 w-1/3 bg-gray-100 dark:bg-neutral-900 rounded-md"></div>
                                </div>
                            </div>

                            {/* Footer Button Placeholder */}
                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gray-50 dark:bg-neutral-800/50 border-t border-gray-100 dark:border-neutral-800"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
