"use client";

import dynamic from "next/dynamic";
import "@/assets/styles/cyberpunk.css";

// Dynamically import LeafletMap with no SSR to avoid 'window is not defined'
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-screen flex items-center justify-center bg-black text-cyan-500 font-cyberpunk animate-pulse">
            <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="tracking-widest uppercase">Initializing Neural Link...</p>
            </div>
        </div>
    ),
});

export default function PetaPage() {
    return (
        <div className="w-full h-screen overflow-hidden bg-black">
            <LeafletMap />
        </div>
    );
}
