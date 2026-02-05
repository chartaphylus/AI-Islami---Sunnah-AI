import { NextResponse } from 'next/server';
import { getSyariahAnswer } from '@/lib/ai';
import { supabase } from '@/lib/supabase';

export async function POST(req: Request) {
    const startTime = Date.now();
    try {
        const { query, messages = [], context = 'syariah' } = await req.json();

        // Support both single turn (query) and multi-turn (messages)
        const currentQuery = query || (messages.length > 0 ? messages[messages.length - 1].content : '');

        if (!currentQuery) {
            return NextResponse.json({ error: "Pertanyaan tidak boleh kosong" }, { status: 400 });
        }

        // 1. Normalize Query for Caching (More Robust)
        const normalize = (txt: string) => txt.trim().toLowerCase()
            .replace(/[?.,!]/g, '')
            .replace(/sholat/g, 'shalat')
            .replace(/shollat/g, 'shalat')
            .replace(/solat/g, 'shalat')
            .replace(/sholawat/g, 'shalawat')
            .replace(/\s+/g, ' ');

        const normalizedQuery = normalize(currentQuery);

        // 2. Check Database for Match (Keyword Intersection)
        // We extract core keywords to handle reordered questions (semantic matching)
        const stopWords = ['apa', 'hukum', 'adalah', 'bagaimana', 'apakah', 'tentang', 'pada', 'soalnya', 'pda', 'dan', 'yg', 'itu'];
        const coreKeywords = normalizedQuery.split(' ')
            .filter(word => word.length > 3)
            .filter(word => !stopWords.includes(word));

        let matchedCache = null;

        if (coreKeywords.length > 0) {
            // Build a query that looks for the intersection of keywords
            let queryBuilder = supabase.from('ai_responses').select('*');
            coreKeywords.forEach(kw => {
                queryBuilder = queryBuilder.ilike('question', `%${kw}%`);
            });

            const { data: keywordMatch, error: kwError } = await queryBuilder
                .order('usage_count', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (keywordMatch && !kwError) {
                matchedCache = keywordMatch;
            }
        }

        // Fallback to simpler search if keyword intersection fails
        if (!matchedCache) {
            const { data: simpleMatch } = await supabase
                .from('ai_responses')
                .select('*')
                .or(`question.ilike.%${normalizedQuery}%,answer.ilike.%${normalizedQuery}%`)
                .order('usage_count', { ascending: false })
                .limit(1)
                .maybeSingle();
            matchedCache = simpleMatch;
        }

        if (matchedCache) {
            // Update usage count asynchronously
            supabase.from('ai_responses').update({
                usage_count: (matchedCache.usage_count || 1) + 1
            }).eq('id', matchedCache.id).then();

            const endTime = Date.now();
            const latency = ((endTime - startTime) / 1000).toFixed(2);

            return NextResponse.json({
                answer: matchedCache.answer,
                sources: matchedCache.sources || [],
                cached: true,
                latency: latency
            });
        }

        // 3. Fallback to AI (Multi-turn support)
        const apiMessages = messages.length > 0 ? messages : [{ role: 'user', content: currentQuery }];
        const answer = await getSyariahAnswer(apiMessages, context);

        // 4. SMART PERSISTENCE (Requirement Analysis)
        // Check if there is a SIMILAR question with the EXACT SAME answer
        // If yes, we don't save to avoid redundancy.
        // If the answer is different or it's a new topic, we save it.
        const { data: similarEntries } = await supabase
            .from('ai_responses')
            .select('answer')
            .ilike('question', `%${normalizedQuery}%`)
            .limit(5);

        const isDuplicateAnswer = similarEntries?.some(entry => entry.answer === answer);

        if (!isDuplicateAnswer) {
            try {
                await supabase.from('ai_responses').upsert({
                    question: currentQuery,
                    answer: answer,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'question' });
            } catch (saveError) {
                console.error("Failed to cache AI response:", saveError);
            }
        }

        const endTime = Date.now();
        const latency = ((endTime - startTime) / 1000).toFixed(2);

        return NextResponse.json({
            answer,
            sources: [],
            cached: false,
            latency: latency
        });

    } catch (error: any) {
        console.error("Search API Error:", error);
        const endTime = Date.now();
        const latency = ((endTime - startTime) / 1000).toFixed(2);

        return NextResponse.json({
            answer: `## 🔍 Referensi Tidak Ditemukan\n\nMohon maaf, kami tidak dapat menemukan jawaban yang pasti di dalam database referensi terpercaya kami saat ini.\n\n_Wallahu a'lam bish-shawab._`,
            latency: latency
        });
    }
}
