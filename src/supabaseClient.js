import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nkcewwfgbduupuhtaeeq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rY2V3d2ZnYmR1dXB1aHRhZWVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgxMjkxNjAsImV4cCI6MjA3MzcwNTE2MH0.hyk0OJJa5mx8ROq06QBEwk2qqmFfNROD5QJdotW0Qz8'

export const supabase = createClient(supabaseUrl, supabaseKey)
