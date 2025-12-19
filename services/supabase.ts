
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wkepglevoojirkdkbrjj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndrZXBnbGV2b29qaXJrZGticmpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjYwODYxNzAsImV4cCI6MjA4MTY2MjE3MH0.Uwl4TfKvzZ9oUPovIYOveAFZbXZz89_mtIohh5A38i4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
