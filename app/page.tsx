import SearchUI from "@/components/SearchUI";

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col items-center justify-center px-4 selection:bg-emerald-100 selection:text-emerald-900 overflow-hidden -mt-10 md:-mt-0">

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/20 dark:to-transparent -z-10 pointer-events-none" />
      <div className="absolute top-[10%] left-[10%] w-[300px] h-[300px] bg-emerald-200/20 dark:bg-emerald-800/10 rounded-full blur-[80px] -z-10 pointer-events-none animate-pulse duration-[5000ms]" />
      <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[300px] bg-teal-200/20 dark:bg-teal-800/10 rounded-full blur-[80px] -z-10 pointer-events-none animate-pulse duration-[7000ms]" />

      {/* Main Content */}
      <div className="w-full max-w-4xl flex flex-col items-center text-center space-y-8 z-10">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 dark:bg-white/5 border border-emerald-100 dark:border-white/5 backdrop-blur-sm text-emerald-700 dark:text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2 animate-in fade-in zoom-in duration-500">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Mesin Pencari Islam Terpercaya
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight drop-shadow-sm">
          Salaf<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">.AI</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Temukan jawaban syariah berdasarkan Al-Qur'an dan Sunnah dengan pemahaman para Salafus Shalih.
        </p>

        {/* Search */}
        <div className="w-full max-w-2xl mt-8">
          <SearchUI />
        </div>

      </div>

      {/* Footer / Credits */}
      <footer className="absolute bottom-6 text-center space-y-2 animate-in fade-in duration-1000 delay-500">
        <p className="text-xs text-gray-400 dark:text-gray-600">Sumber Data: Yufid, Rumaysho, Muslim.or.id, Almanhaj</p>
        <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-600/50 dark:text-emerald-400/50">
          By. M.K Bahtiar
        </p>
      </footer>

    </div>
  );
}
