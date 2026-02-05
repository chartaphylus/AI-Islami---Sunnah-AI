import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
            return NextResponse.json({ error: "Supabase configuration missing" }, { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // 1. Fetch Eras (Main Table)
        const { data: eras, error: erasError } = await supabase
            .from('peta_sejarah')
            .select('*')
            .order('year_start_m', { ascending: true })
            .range(0, 1000);

        if (erasError) {
            console.error('Eras Fetch Error:', erasError);
            return NextResponse.json({ error: erasError.message }, { status: 500 });
        }

        // 2. Fetch Related Data (Manually since FKs are missing)
        // We attempt to fetch leaders and relics. If these tables don't exist, Supabase returns an error, we handle it gracefully.
        const { data: leadersData, error: leadersError } = await supabase.from('leaders').select('*').limit(1000);
        const { data: relicsData, error: relicsError } = await supabase.from('relics').select('*').limit(1000);

        const leaders = leadersError ? [] : leadersData;
        const relics = relicsError ? [] : relicsData;

        // 3. Map Data
        // Assuming leaders/relics have an 'era_id' that matches peta_sejarah 'id'
        // 3. Map Data
        // Assuming leaders/relics have an 'era_id' that matches peta_sejarah 'id'
        const formattedData = eras.map((era: any) => {
            const eraLeaders = leaders
                ? leaders.filter((l: any) => l.era_id == era.id)
                : (era.leader_info || []);

            const eraRelics = relics
                ? relics.filter((r: any) => r.era_id == era.id)
                : (era.relics || []);

            return {
                ...era,
                leader_info: eraLeaders,
                relics: eraRelics
            };
        });

        return NextResponse.json(formattedData);
    } catch (err) {
        console.error('API error:', err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
