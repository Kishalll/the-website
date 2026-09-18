import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseInstance = null;

if (supabaseUrl && supabaseAnonKey) {
    try {
        supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
    } catch (err) {
        console.warn('Supabase client failed to initialize:', err);
    }
}

export const supabase = supabaseInstance;
export const isSupabaseConfigured = Boolean(supabaseInstance);
