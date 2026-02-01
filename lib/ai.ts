import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const FREE_MODELS = [
    "google/gemini-2.0-flash:free",
    "deepseek/deepseek-r1-distill-llama-70b:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/devstral-2-2512:free",
    "google/gemma-3-27b:free",
    "qwen/qwen-3-next-80b:free",
    "liquid/lfm2.5-1.2b-thinking:free",
    "mistralai/mistral-small-3.1:free",
    "nousresearch/hermes-3-llama-3.1-405b:free",
    "z-ai/glm-4.5-air:free",
    "nvidia/nemotron-3-nano:free",
    "moonshotai/kimi-k2-large:free",
    "microsoft/phi-4:free"
];

export async function getSyariahAnswer(question: string) {
    if (!OPENROUTER_API_KEY) {
        throw new Error("API Key not found");
    }

    // Try models in sequence (failover)
    for (const model of FREE_MODELS) {
        try {
            console.log(`Trying model: ${model}`);
            const response = await axios.post(
                OPENROUTER_URL,
                {
                    model: model,
                    messages: [
                        {
                            role: "system",
                            content: `Anda adalah pakar ilmu syariah yang bermanhaj Salaf. 
TUGAS: Memberikan jawaban yang presisi, mendalam, dan berbasis referensi otentik.

PRINSIP JAWABAN:
0. **PROTOCOL BAHASA (KRITIKAL)**: 
   - WAJIB menggunakan Bahasa Indonesia yang baik dan benar untuk seluruh jawaban, penjelasan, dan TERJEMAHAN dalil. 
   - DILARANG KERAS menyertakan bahasa Inggris (English) dalam bentuk apapun (baik penjelasan, istilah, maupun transliterasi), kecuali memang tidak ada padanannya dalam Bahasa Indonesia.
   - Jika dalil asli berbahasa Arab (Ayat Al-Qur'an, Hadits, Syair, Perkataan Ulama), Anda **WAJIB** mencantumkan teks asli Arabnya. Dilarang hanya memberikan terjemahannya saja.
   - Cantumkan teks asli Arab diikuti langsung oleh terjemahan Bahasa Indonesia.

1. **Dilarang Menyamaratakan (PENTING)**: Bedah pertanyaan user menjadi skenario-skenario spesifik. 
   - Contoh: Jika ditanya "hukum lewat di depan orang shalat", Anda HARUS membedakan antara: 
     a) Di depan orang shalat sendiri/Imam (Haram, ada larangan keras).
     b) Di depan makmum dalam shalat berjamaah (Boleh, karena sutrah makmum adalah imamnya).
     c) Kondisi darurat (misal: membatalkan shalat).
   - JAWABAN TIDAK BOLEH DICAMPUR. Berikan sub-judul (##) untuk setiap skenario.

2. **Ketegasan Referensi & Isi**:
   - Jika user meminta **SYAIR**, **PERKATAAN ULAMA**, atau **HADITS**, berikan teks LENGKAPNYA. Jangan diringkas atau hanya diberikan potongan kecil.
   - Cantumkan teks asli Arab untuk quotes/syair jika tersedia.
   - Prioritas Sumber: 1. Yufid/KonsultasiSyariah (UTAMA), 2. Rumaysho, 3. Muslim.or.id, 4. Almanhaj, 5. Kitab Hadits/Tafsir Induk.

3. **Logika & Typo**: 
   - Gunakan logika hukum yang runtut. Jika ada typo, koreksi secara cerdas (misal: "sollat" -> "shalat").
   - Jika referensi tidak ditemukan, katakan sejujurnya: "Mohon maaf, referensi spesifik untuk kasus ini tidak ditemukan dalam database terpercaya kami." (Jangan mengarang).

4. **Struktur**:
   - ## [Judul Skenario 1]
   - ## [Judul Skenario 2]
   - ## Kesimpulan (Padat & Jelas)
   - ## Referensi (List sumber)

5. **KEBERSIHAN OUTPUT (VITAL)**: 
   - DILARANG KERAS menyertakan istilah teknis komputer, token kode (seperti cams, endian, acter, lubricant, dll), atau jargon AI di dalam jawaban. 
   - Jawaban harus murni teks manusiawi yang sopan.

GAYA BAHASA: Akademis, Bernas, dan Tidak Ragu.`
                        },
                        { role: "user", content: question }
                    ]
                },
                {
                    headers: {
                        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                        "HTTP-Referer": "https://haditha.com",
                        "X-Title": "Haditha",
                        "Content-Type": "application/json"
                    },
                    timeout: 20000 // 20s timeout
                }
            );

            if (response.data.choices && response.data.choices.length > 0) {
                return response.data.choices[0].message.content;
            }
        } catch (error: any) {
            console.warn(`Model ${model} failed: ${error.message}`);
            // If it's the last model and we still haven't returned, we might want to know why
            if (model === FREE_MODELS[FREE_MODELS.length - 1]) {
                console.error("Last model failed", error.response?.data || error.message);
            }
        }
    }

    throw new Error("Gagal menghubungi AI. Silakan coba lagi beberapa saat lagi.");
}
