import { PAGE_SIZE } from "../utils/constants";
import supabase from "./supabase";

const checkIfSectorExists = async (name) => {
  const { data, error } = await supabase
    .from("sector") // Replace with your table name
    .select("id")
    .eq("name", name);

  if (error) {
    console.error("Error checking for existing sector:", error);
    return false;
  }

  return data.length > 0; // Returns true if a match is found, false otherwise
};

export async function getSector({ page, searchTerm }) {
  let query = supabase
    .from("sector")
    .select("*", {
      count: "exact",
    })
    .order("name", { ascending: true });

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
    throw new Error("Sector could not be loaded");
  }

  return { data, count };
}
export async function createEditSector(newElectorate, id) {
  // 1. Create/edit cabin
  let query = supabase.from("sector");

  // A) CREATE
  if (!id) {
    const userExists = await checkIfSectorExists(newElectorate.name);

    // if (userExists) {
    //   throw new Error("Data already exists. Not saving data.");

    // }
    query = query.insert([{ ...newElectorate }]);
  }
  // A) CREATE
  // if (!id) query = query.insert([{ ...newElectorate }]);

  // B) EDIT
  if (id)
    query = query
      .update({
        ...newElectorate,
      })
      .eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Sector name already exists.");
  }

  return data;
}
export async function deleteSector(id) {
  const { data, error } = await supabase.from("sector").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Sector could not be deleted");
  }

  return data;
}
