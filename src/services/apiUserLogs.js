import { PAGE_SIZE } from "../utils/constants";
import supabase from "./supabase";

export async function fetchAllData_Logs() {
  const today = new Date().toISOString();
  const fiveDaysAgo = new Date(
    Date.now() - 5 * 24 * 60 * 60 * 1000
  ).toISOString();

  const oneMonthAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();
  let data = [];
  let from = 0;
  const limit = 1000;

  while (true) {
    let query = supabase
      .from("user_logs")
      .select(`*, users (email,account_role)`, { count: "exact" })
      .order("created_at", { ascending: false })
      .range(from, from + limit - 1)
      .gte("created_at", oneMonthAgo);
    // .gte("created_at", fiveDaysAgo)
    // .lte("created_at", today);

    const { data: chunk, error } = await query;

    if (error) {
      throw error;
    }

    if (chunk.length === 0) {
      break;
    }

    data = [...data, ...chunk];
    from += limit;
    // If the number of rows fetched is less than the limit, we know we are at the end
    if (chunk.length < limit) {
      break;
    }
  }

  return data;
}

export async function getLogs({ page, searchTerm }) {
  const today = new Date().toISOString();
  const fiveDaysAgo = new Date(
    Date.now() - 5 * 24 * 60 * 60 * 1000
  ).toISOString();
  const oneMonthAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  let query = supabase
    .from("user_logs")
    .select(`*, users (email,account_role)`, { count: "exact" })
    .order("created_at", { ascending: false })
    .gte("created_at", oneMonthAgo);
  // .gte("created_at", fiveDaysAgo)
  // .lte("created_at", today);

  if (searchTerm) {
    query = query.or(`page.ilike.%${searchTerm}%,action.ilike.%${searchTerm}%`);
  }

  if (!searchTerm && page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Logs could not be loaded");
  }

  return { data, count };
}

export async function getUsers() {
  // const { data, error } = await supabase.from("users").select("*");
  const { data, error } = await supabase
    .from("users")
    .select(`*, team (firstname,lastname)`)
    .order("created_at", { ascending: false });
  if (error) {
    console.error(error);
    throw new Error("Users could not be loaded");
  }

  return data;
}
