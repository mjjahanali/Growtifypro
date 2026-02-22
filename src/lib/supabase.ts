import { createClient } from '@supabase/supabase-js';

// Helper to get env vars safely in both Node and Browser
const getEnv = (name: string) => {
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name];
  }
  // @ts-ignore - Vite specific
  return import.meta.env?.[`VITE_${name}`] || import.meta.env?.[name];
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY');

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
