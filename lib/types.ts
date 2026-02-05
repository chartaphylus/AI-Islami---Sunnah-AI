export interface Doa {
    id: number | string;
    nama: string;
    grup: string;
    tag: string[];
    ar?: string;
    tr?: string;
    idn?: string;
    tentang?: string;
    source?: string;
    judul?: string;
}

export interface Hadith {
    id: number;
    book_id: number;
    chapter_id: number;
    hadith_number: number;
    text_ar: string;
    text_en: string; // or idn if schema changed, but schema says text_en
    narrator: string;
}

export interface HadithBook {
    id: number;
    slug: string;
    name_ar: string;
    name_en: string;
    name_id: string; // from schema
}
