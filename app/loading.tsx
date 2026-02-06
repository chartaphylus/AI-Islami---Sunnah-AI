export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-white dark:bg-black fixed inset-0 z-[100]">
            <div className="flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-emerald-500/20 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <h3 className="text-emerald-500 font-bold text-lg animate-pulse">AI Islami</h3>
                    <p className="text-gray-400 text-xs font-medium tracking-widest uppercase">Memuat...</p>
                </div>
            </div>
        </div>
    );
}
