"use client";

import { Activity, Book, Heart, Info, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
    const stats = [
        { label: "Hadits Digital", value: "9+", icon: Book },
        { label: "Pengguna Aktif", value: "10K", icon: Activity },
        { label: "Fitur Gratis", value: "100%", icon: Heart },
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Header */}
            <div className="relative overflow-hidden bg-emerald-600 pb-32 pt-20 px-4 rounded-b-[3rem]">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />

                <div className="relative z-10 max-w-2xl mx-auto text-center text-white space-y-4">
                    <Link href="/" className="inline-flex items-center gap-2 text-emerald-100 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Kembali ke Dashboard</span>
                    </Link>
                    <h1 className="text-3xl md:text-5xl font-bold tracking-tight">Mengenal Haditha</h1>
                    <p className="text-emerald-100 max-w-md mx-auto leading-relaxed">
                        Menjembatani kemurnian ilmu syar'i dengan kecanggihan teknologi modern untuk umat.
                    </p>
                </div>
            </div>

            {/* Content Card */}
            <div className="relative z-20 max-w-3xl mx-auto px-4 -mt-24 space-y-6 pb-20">

                {/* Vision Mission */}
                <div className="bg-white dark:bg-neutral-900 rounded-3xl p-6 md:p-8 shadow-xl border border-gray-100 dark:border-neutral-800 space-y-8">
                    <div className="text-center">
                        <div className="inline-flex p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 mb-4">
                            <Info className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Visi Kami</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                                Menjadi asisten digital terpercaya bagi setiap Muslim dalam mempelajari agama sesuai pemahaman Salafus Shalih, dengan data yang valid dan otentik.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Misi Kami</h3>
                            <ul className="text-sm text-gray-500 dark:text-gray-400 space-y-2 list-disc list-inside">
                                <li>Menyediakan akses hadits yang mudah.</li>
                                <li>Mengintegrasikan AI untuk pencarian dalil.</li>
                                <li>Menjaga kemurnian referensi ilmiah.</li>
                            </ul>
                        </div>
                    </div>

                    <hr className="border-gray-100 dark:border-neutral-800" />

                    {/* Stats */}
                    <div className="grid grid-cols-3 divide-x divide-gray-100 dark:divide-neutral-800">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center px-2">
                                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</div>
                                <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wide">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team & Tech */}
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-neutral-800/50 p-6 rounded-3xl border border-gray-100 dark:border-neutral-800">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Manhaj & Sumber Data</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            Referensi utama aplikasi ini diambil dari kitab-kitab induk (Kutubut Tis'ah) serta fatwa ulama Ahlussunnah wal Jama'ah yang terpercaya.
                        </p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-900/20">
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">Salafy Tech</h4>
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 leading-relaxed mb-4">
                            Dikembangkan dengan cinta oleh M.K Bahtiar sebagai kontribusi untuk dakwah digital.
                        </p>
                        <a href="https://mkbahtiar.web.id" target="_blank" className="text-xs font-bold underline" rel="noreferrer">
                            Lihat Portofolio
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
