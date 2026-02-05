"use client";

import Link from "next/link";
import { Bot, ArrowLeft } from "lucide-react";
import SearchUI from "@/components/SearchUI";

export default function AIPage() {
    return (
        <div className="fixed inset-0 z-0 md:static md:min-h-screen md:pt-10 md:pb-10 md:px-8 bg-gray-50 dark:bg-black">
            <div className="w-full h-full md:h-auto max-w-5xl mx-auto md:min-h-[750px]">
                <SearchUI />
            </div>
        </div>
    );
}
