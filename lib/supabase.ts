import { createClient } from '@supabase/supabase-js';

// Create Supabase client
const getSupabaseCredentials = () => {
    const supabaseUrl = process.env.SUPABASE_PROJECT_URL;
    const supabaseApiKey = process.env.SUPABASE_API_KEY;

    if (!supabaseUrl) {
        throw new Error('Missing SUPABASE_PROJECT_URL');
    }
    if (!supabaseApiKey) {
        throw new Error('Missing SUPABASE_KEY');
    }

    return { supabaseUrl, supabaseApiKey };
};
const creds = getSupabaseCredentials();
export const supabase = createClient(creds.supabaseUrl, creds.supabaseApiKey, { auth: { persistSession: false } });
