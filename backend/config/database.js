import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('⚠️  Missing Supabase configuration!');
  console.error('Please set the following environment variables in Render Dashboard:');
  console.error('  - SUPABASE_URL');
  console.error('  - SUPABASE_SERVICE_KEY');
  console.error('  - SUPABASE_ANON_KEY');
  console.error('\nGo to: Render Dashboard > Your Service > Environment');
  throw new Error('Missing Supabase configuration. Please configure environment variables in Render Dashboard.');
}

// Service role client (for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Anon client (for user operations)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabaseAdmin;

