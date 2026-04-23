/// <reference types="vite/client" />
/**
 * Browser-side Supabase client.
 * Uses VITE_-prefixed env vars so Vite exposes them to the bundle.
 * The service role key is NEVER exposed here — only the anon key.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[supabaseClient] VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is not set. Auth and client-side data features will be unavailable.');
}

export const supabaseClient = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
