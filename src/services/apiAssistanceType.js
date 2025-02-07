import { PAGE_SIZE } from "../utils/constants";
import supabase from "./supabase";

const checkIfExists = async (name) => {
  const { data, error } = await supabase
    .from("assistance_type") // Replace with your table name
    .select("id")
    .eq("name", name);

  if (error) {
    console.error("Error checking for existing assistance type:", error);
    return false;
  }

  return data.length > 0; // Returns true if a match is found, false otherwise
};

export async function getAssType({ page }) {
  let query = supabase
    .from("assistance_type")
    .select("*", {
      count: "exact",
    })
    .order("name", { ascending: true });

  if (page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Assistance Type could not be loaded");
  }

  return { data, count };
}
export async function createEditAssType(newElectorate, id) {
  // 1. Create/edit cabin
  let query = supabase.from("assistance_type");

  // A) CREATE
  if (!id) {
    // const userExists = await checkIfExists(newElectorate.name);
    // if (userExists) {
    //   throw new Error("Data already exists. Not saving data.");
    //   // return null;
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
    throw new Error("Assistance Type already exist.");
  }

  return data;
}
export async function deleteAssType(id) {
  const { data, error } = await supabase
    .from("assistance_type")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Assistance Type could not be deleted");
  }

  return data;
}
