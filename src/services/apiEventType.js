import { PAGE_SIZE } from "../utils/constants";
import supabase from "./supabase";

const checkIfExists = async (name) => {
  const { data, error } = await supabase
    .from("event_type") // Replace with your table name
    .select("id")
    .eq("type_name", name);

  if (error) {
    console.error("Error checking for existing event type:", error);
    return false;
  }

  return data.length > 0;
};

export async function getEvenType({ page, searchTerm }) {
  let query = supabase
    .from("event_type")
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
    throw new Error("Event Type could not be loaded");
  }

  return { data, count };
}

export async function createEditEvent(newElectorate, id) {
  console.log("event here adding", JSON.stringify(newElectorate));
  // 1. Create/edit cabin
  let query = supabase.from("event_type");

  // A) CREATE
  // if (!id) {
  const userExists = await checkIfExists(newElectorate.type_name);

  if (userExists) {
    throw new Error("Data already exists. Not saving data.");
  }
  query = query.insert([{ ...newElectorate }]);
  // }
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
    throw new Error("Event name already exists.");
  }

  return data;
}
export async function deleteEventType(id) {
  const { data, error } = await supabase
    .from("event_type")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Event type could not be deleted");
  }

  return data;
}
