import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const adminPassword = process.env.WEBSITE_ADMIN_PASSWORD!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);