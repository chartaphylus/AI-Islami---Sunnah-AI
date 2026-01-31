import { NextResponse } from 'next/server';
import { getSyariahAnswer } from '@/lib/ai';

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        if (!query) {
            return NextResponse.json({ error: "Pertanyaan tidak boleh kosong" }, { status: 400 });
        }

        const answer = await getSyariahAnswer(query);

        return NextResponse.json({
            answer,
            // Sources could be added here if we implement scraping later
            sources: []
        });

    } catch (error: any) {
        console.error("Search API Error:", error);
        // Fallback: Rather than showing a scary error, allow the UI to render a polite message
        // This satisfies "jangan berikan pesan error namun bilang referensi jawaban tidak ditemukan"
        return NextResponse.json({
            answer: `## 🔍 Referensi Tidak Ditemukan

Mohon maaf, kami tidak dapat menemukan jawaban yang pasti di dalam database referensi terpercaya kami (Yufid, Rumaysho, Muslim.or.id, dll) untuk pertanyaan tersebut.

**Saran langkah selanjutnya:**
- Pastikan tidak ada kesalahan ketik (typo) pada kata kunci utama.
- Coba gunakan kalimat tanya yang lebih sederhana atau umum.
- Jika ini mengenai masalah fiqih kontemporer yang sangat spesifik, mungkin referensi digital kami belum mencakupnya secara mendalam.

_Wallahu a'lam bish-shawab._`
        });
    }
}
