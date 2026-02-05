import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
// In server context (API routes), we should prioritize the SERVICE_ROLE_KEY to bypass RLS
// In client context, we use the public ANON_KEY
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY || process.env.SUPABASE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
    console.warn('Missing Supabase URL or Key in environment variables.');
}

// Ensure createClient never throws at module level (prevent 500 error)
const safeUrl = supabaseUrl || 'https://placeholder.supabase.co';
const safeKey = supabaseKey || 'placeholder';

export const supabase = createClient(safeUrl, safeKey);
