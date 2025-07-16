import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xbhbsfcarvzwixlgqmfo.supabase.co'; // NÃO use localhost aqui!
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiaGJzZmNhcnZ6d2l4bGdxbWZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MzE4MzAsImV4cCI6MjA2ODIwNzgzMH0.PDOkAP8x-onErweVJw0VwGnepIWwe1Fyn4x0p0tkwlc';

export const supabase = createClient(supabaseUrl, supabaseKey);