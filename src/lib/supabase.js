import { createClient } from '@supabase/supabase-js';

let supabaseUrl = null;
let supabaseAnonKey = null;

try {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  }
} catch {
  // Hermes / React Native fallback
}

let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase initialized successfully');
} else {
  console.warn('Supabase config missing. Running in local mock mode.');
}

export { supabase };
