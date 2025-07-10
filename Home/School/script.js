import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabaseUrl = 'https://ncakkdifznvsyjcegtcr.supabase.co'
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5jYWtrZGlmem52c3lqY2VndGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE1Mzk0NTIsImV4cCI6MjA2NzExNTQ1Mn0.KiY3hm7-fncxia-12MBKuUCUcJcJezAoLTx8GP-AohU"
const supabase = createClient(supabaseUrl, supabaseKey)
const { data: marks, error } = await supabase.from('marks').select('mark_id')
console.log(marks)