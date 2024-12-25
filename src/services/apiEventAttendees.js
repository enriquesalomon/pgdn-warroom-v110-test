import { PAGE_SIZE } from "../utils/constants";
import supabase from "./supabase";
export async function getElectoratesPer_Brgy2({ brgy, page, searchTerm }) {
  let query = supabase
    .from("electorates")
    .select(
      "id,precinctno, firstname,middlename,lastname,birthdate,brgy,completeaddress,purok,city,profession,religion,image,sector,qr_code",
      {
        count: "exact",
      }
    )
    .eq("brgy", brgy)
    .order("id", { ascending: false });

  if (searchTerm) {
    query = query.or(
      `lastname.ilike.%${searchTerm}%,firstname.ilike.%${searchTerm}%,middlename.ilike.%${searchTerm}%,sector.ilike.%${searchTerm}%`
    );
  }

  if (!searchTerm && page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;
  if (error) {
    console.error(error);
    throw new Error("electorates could not be loaded");
  }
  return { data, count };
}
export async function getEvents({ page, searchTerm }) {
  let query = supabase
    .from("events")
    .select("*", {
      count: "exact",
    })
    // .eq("is_active", true)
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
export async function getEventAttendees({ event, brgy, page, searchTerm }) {
  let query = supabase
    .from("event_attendees")
    .select("*", { count: "exact" })
    .eq("event_id", event)
    .order("created_at", { ascending: false });

  if (searchTerm) {
    query = query.or(
      `firstname.ilike.%${searchTerm}%,lastname.ilike.%${searchTerm}%`
    );
  }

  if (!searchTerm && page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Attendees could not be loaded");
  }
  return { data, count };
}
export async function deleteAttendees(id) {
  const { data, error } = await supabase
    .from("event_attendees")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Event attendees could not be deleted");
  }

  return { data, error };
}
