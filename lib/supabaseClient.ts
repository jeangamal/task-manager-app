import { createClient } from '@supabase/supabase-js';

// Create a Supabase client using environment variables. These are
// exposed to the browser at build time via NEXT_PUBLIC_ prefixes.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);