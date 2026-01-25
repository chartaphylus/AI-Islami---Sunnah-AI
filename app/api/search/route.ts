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
            answer: `## ⚠️ Referensi Tidak Ditemukan

Mohon maaf, saat ini kami belum dapat menemukan referensi dalil yang spesifik untuk pertanyaan tersebut, atau sistem sedang mengalami kendala teknis.

**Saran:**
- Coba gunakan kata kunci yang lebih umum.
- Periksa kembali ejaan pertanyaan Anda.
- Silakan coba beberapa saat lagi.

_Wallahu a'lam bish-shawab._`
        });
    }
}
