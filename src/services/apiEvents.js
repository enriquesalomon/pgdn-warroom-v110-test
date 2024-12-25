import { PAGE_SIZE } from "../utils/constants";
import supabase from "./supabase";

export async function getEvents({ page, searchTerm }) {
  let query = supabase
    .from("events")
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
    throw new Error("Event could not be loaded");
  }

  return { data, count };
}
export async function createEditEvent(newElectorate, id) {
  console.log("event here adding", JSON.stringify(newElectorate));

  let query = supabase.from("events");

  // A) CREATE
  if (!id) query = query.insert([{ ...newElectorate }]);

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
    throw new Error("Something went wrong, please double check data inputted");
  }

  return data;
}
export async function deleteEvent(id) {
  const { data, error } = await supabase.from("events").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Event could not be deleted");
  }

  return { data, error };
}

export async function deactivateEvent(id) {
  const { data, error } = await supabase
    .from("events")
    .update({ is_active: false })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Event successfully deactivated");
  }

  return data;
}

export async function activateEvent(id) {
  const { data, error } = await supabase
    .from("events")
    .update({ is_active: true })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Event could not be updated");
  }

  return data;
}
