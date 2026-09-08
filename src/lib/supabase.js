import { createClient } from '@supabase/supabase-js'

let env = {};
try {
  if (typeof import.meta !== 'undefined' && import.meta && import.meta.env) {
    env = import.meta.env;
  }
} catch (e) {
  // Ignorar en entornos que no soportan import.meta
}

if (!env.VITE_SUPABASE_URL && typeof process !== 'undefined' && process && process.env) {
  env = process.env;
}

const supabaseUrl = env.VITE_SUPABASE_URL || env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY || env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log('Supabase initialized successfully')
} else {
  console.warn('Supabase config missing. Running in local mock mode.')
}

export { supabase }
