import { PAGE_SIZE, ato, validationIds } from "../utils/constants";
import supabase from "./supabase";

export async function getScanned_Voters({
  voters_remarks,
  brgy,
  page,
  searchTerm,
}) {
  let query = supabase
    .from("voters_scans")
    .select(
      `*,team(firstname, lastname),electorates(precinctno,firstname,middlename,lastname,purok)`,
      {
        count: "exact",
      }
    )
    .eq("brgy", brgy)
    // .eq("scanned_type", "APP")
    .order("id", { ascending: false });

  // if (voters_remarks === "1") {
  //   query = query.eq("scanned_remarks", "ALLIED VOTER");
  // } else if (voters_remarks === "2") {
  //   query = query.eq("scanned_remarks", "SWING VOTER");
  // } else {
  //   query = query.eq("scanned_remarks", "ALLIED VOTER");
  // }

  if (searchTerm) {
    query = query.or(
      `lastname.ilike.%${searchTerm}%,firstname.ilike.%${searchTerm}%,middlename.ilike.%${searchTerm}%,precinctno.ilike.%${searchTerm}%`
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
export async function getAllVoters_Unscanned({ brgy, page, searchTerm }) {
  const { data, count, error } = await supabase.rpc(
    "get_all_voters_unscanned",
    { brgy_param: brgy, page: page, searchterm: searchTerm }
  );

  if (error) console.error(error);
  if (error) {
    console.error(error);
    throw new Error("electorates could not be loaded");
  }
  return { data, count };
}

export async function createEditVoters(newUserData) {
  console.log("XXX", JSON.stringify(newUserData));

  // Construct the object to insert
  const dataToInsert = {
    electorate_id: newUserData.id, // Insert array element into electorate_id
    brgy: newUserData.brgy,
    scanned_remarks: newUserData.scanned_remarks,
    team_id: newUserData.team_id,
    user_id: newUserData.user_id,
    scanned_type: "MANUAL",
    notes: newUserData.notes,
  };

  // Insert into electorate_validations table
  const { data, error } = await supabase
    .from("voters_scans")
    .insert([dataToInsert])
    .select();
  if (error) {
    console.error(error);
    throw new Error(
      "This person has already been scanned/verified. Duplicate entry is not allowed."
    );
  } else {
    console.log("success insterted voters_scans", data);
  }
  try {
    // Update the electorates table
    const { data: updateData, error: updateError } = await supabase
      .from("electorates")
      .update({ final_validation: true })
      .eq("id", newUserData.id)
      .select()
      .single();
    if (updateError) {
      console.error(
        "Error updating electorates final validation record:",
        updateError
      );
    } else {
      console.log("Data updated successfully:", updateData);
    }
    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred during processing.");
  }
}
