// import { useQueryClient } from "@tanstack/react-query";
import supabase from "../services/supabase";
export async function insertLogs(params) {
  let query = supabase.from("user_logs");
  await query.insert({ ...params });
}
