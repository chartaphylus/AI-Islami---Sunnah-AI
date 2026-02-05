'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';

export async function getChapters(bookId: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('hadith_chapters')
            .select('id, title_ar, title_en, chapter_number')
            .eq('book_id', bookId)
            .order('chapter_number', { ascending: true });

        if (error) {
            console.error('Error fetching chapters:', error);
            return [];
        }
        return data;
    } catch (error) {
        console.error('Unexpected error fetching chapters:', error);
        return [];
    }
}

export async function getChapterDetail(chapterId: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('hadith_chapters')
            .select('id, title_ar, title_en, chapter_number')
            .eq('id', chapterId)
            .single();

        if (error) {
            console.error('Error fetching chapter detail:', error);
            return null;
        }
        return data;
    } catch (error) {
        console.error('Unexpected error fetching chapter detail:', error);
        return null;
    }
}
