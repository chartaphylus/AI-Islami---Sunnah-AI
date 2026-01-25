import axios from 'axios';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

const FREE_MODELS = [
    "google/gemini-2.0-flash:free",
    "meta-llama/llama-3.3-70b-instruct:free",
    "mistralai/devstral-2-2512:free",
    "deepseek/deepseek-r1-distill-llama-70b:free",
    "xiaomi/mimo-v2-flash:free",
    "google/gemma-3-27b:free",
    "meta-llama/llama-3.1-405b:free",
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
                            content: `Anda adalah asisten AI Islami yang bermanhaj Salaf.
TUGAS: Jawab pertanyaan user dengan struktur berikut:

1. **Pendahuluan**: Jawaban langsung ke inti pertanyaan (to-the-point).
2. **Penjelasan Detail**: Jelaskan hukum/dalilnya.
    - Gunakan **Heading 2 (##)** untuk memisahkan topik.
    - Pecah paragraf agar tidak terlalu panjang.
    - **WAJIB**: Gunakan Tabel Markdown jika ada perincian (misal: Ahli Waris, Perbedaan Pendapat).
3. **Dalil**:
    - Kutip Ayat/Hadits.
    - Teks Arab WAJIB di baris baru (Block).
    - Terjemahan di bawahnya.
4. **## Kesimpulan** (WAJIB ADA): Rangkuman hukum akhir yang padat & jelas (1-2 kalimat).
5. **Referensi**: (Di bagian paling bawah)
    - Gunakan format list bullet (-)
    - Sebutkan nama kitab/sumber.

GAYA BAHASA: Akademis, Sopan, Mudah dipahami.
FORMATTING: Gunakan Bold **teks** untuk poin penting.`
                        },
                        { role: "user", content: question }
                    ]
                },
                {
                    headers: {
                        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                        "HTTP-Referer": "https://syariahai.com",
                        "X-Title": "Salaf.AI",
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
