import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
// export const supabaseUrl = "https://iammkrzgnupdfdfrqzta.supabase.co";
// const supabaseKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlhbW1rcnpnbnVwZGZkZnJxenRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIzODkwNjIsImV4cCI6MjAyNzk2NTA2Mn0.vL6UCkJcZWfZB3hKzHDP8ipuz5TF91DKd8DTEHtAbbs";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
