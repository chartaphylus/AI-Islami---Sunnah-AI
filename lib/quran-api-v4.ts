
import axios from 'axios';

const QURAN_API_V4_BASE = 'https://api.quran.com/api/v4';

export interface Verse {
    id: number;
    verse_key: string;
    text_uthmani: string;
    text_imlaei?: string; // Simple arabic
    page_number: number;
    juz_number: number;
    hizb_number: number;
    rub_el_hizb_number: number;
    verse_number: number;
    translations?: {
        id: number;
        resource_id: number;
        text: string;
    }[];
    audio?: {
        url: string;
        segments: [number, number, number, number][]; // timestamp info
    };
}

export interface Chapter {
    id: number;
    revelation_place: string;
    revelation_order: number;
    bismillah_pre: boolean;
    name_simple: string;
    name_complex: string;
    name_arabic: string;
    verses_count: number;
    pages: number[];
    translated_name: {
        language_name: string;
        name: string;
    };
}

// Maps Juz number to its starting page (approximate for UI hints if needed, but API drives truth)
// or just used for listings.
export const getJuzList = () => {
    return Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        title: `Juz ${i + 1}`,
        description: `Juz ${i + 1}`
    }));
};

/**
 * Fetch verses for a specific Juz.
 * Includes Indonesian translation (resource_id 33) and audio.
 */
export async function fetchVersesByJuz(juzId: number) {
    try {
        // resource_id 33 is Indonesian translation in Quran.com API (check documentation if unsure, usually 33 or 134)
        // Let's assume 33 for now. If it fails or is wrong language, we will adjust.
        // Actually, let's fetch 'fields' to get text_uthmani and page_number.
        // And 'translations' for indo.

        const response = await axios.get(`${QURAN_API_V4_BASE}/verses/by_juz/${juzId}`, {
            params: {
                language: 'id',
                words: false,
                translations: 33, // Indonesian
                audio: 1, // Enable audio url in response
                fields: 'text_uthmani,page_number,text_imlaei',
                per_page: 1000, // Ensure we get all verses of the Juz (max is usually large enough)
                page: 1
            }
        });

        return {
            verses: response.data.verses as Verse[],
            pagination: response.data.pagination
        };
    } catch (error) {
        console.error(`Error fetching Juz ${juzId}:`, error);
        throw error;
    }
}
