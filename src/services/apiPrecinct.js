import { PAGE_SIZE } from "../utils/constants";
import supabase from "./supabase";

export async function getPrecinct({ page, searchTerm }) {
  let query = supabase
    .from("clustered_precincts")
    .select("*", {
      count: "exact",
    })
    .order("id", { ascending: true });

  // if (searchTerm) {
  //   query = query.or(
  //     `lastname.ilike.%${searchTerm}%,firstname.ilike.%${searchTerm}%,middlename.ilike.%${searchTerm}%,brgy.ilike.%${searchTerm}%`
  //   );
  // }

  if (!searchTerm && page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Precint could not be loaded");
  }

  return { data, count };
}
