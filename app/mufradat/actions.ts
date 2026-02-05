'use server';

import { supabaseAdmin } from '@/lib/supabase-admin';

export interface Mufrodat {
    id: number;
    arabic: string;
    translation: string;
    category: string;
    audio?: string; // Optional if it exists
}

export async function getMufrodatCategories() {
    try {
        // Fetch all categories. Since PostgREST doesn't support SELECT DISTINCT easily on non-unique columns without RPC,
        // we'll fetch all 'category' fields and dedup in JS. 
        // For larger datasets, an RPC 'get_unique_categories' would be better.
        const { data, error } = await supabaseAdmin
            .from('mufradat')
            .select('category');

        if (error) {
            console.error('Error fetching categories:', error);
            return [];
        }

        // Dedup
        const uniqueCategories = Array.from(new Set(data.map((item: any) => item.category))).filter(Boolean).sort();
        return uniqueCategories;

    } catch (error) {
        console.error('Unexpected error fetching categories:', error);
        return [];
    }
}

export async function getMufrodatByCategory(category: string) {
    try {
        const { data, error } = await supabaseAdmin
            .from('mufradat')
            .select('*')
            .eq('category', category)
            .order('id', { ascending: true }); // Or order by arabic?

        if (error) {
            console.error(`Error fetching mufradat for category ${category}:`, error);
            return [];
        }

        return data as Mufrodat[];

    } catch (error) {
        console.error('Unexpected error fetching mufradat list:', error);
        return [];
    }
}

export async function getRandomMufrodat(count: number = 20) {
    try {


        // Fetch a larger batch to shuffle from
        const { data, error } = await supabaseAdmin
            .from('mufradat')
            .select('*')
            .limit(100); // Fetch 100 candidate words

        if (error) {
            console.error('[getRandomMufrodat] Error fetching random mufradat:', error);
            return [];
        }

        if (!data || data.length === 0) {
            console.warn('[getRandomMufrodat] No data returned from mufradat table.');
            return [];
        }



        // Fisher-Yates shuffle
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        const result = shuffled.slice(0, count) as Mufrodat[];


        return result;

    } catch (error) {
        console.error('[getRandomMufrodat] Unexpected error:', error);
        return [];
    }
}
