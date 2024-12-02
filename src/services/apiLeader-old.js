import { PAGE_SIZE } from "../utils/constants";
import supabase from "./supabase";
export async function getElectorates_forLeader({ brgy, page, searchTerm }) {
  let query = supabase
    .from("electorates")
    .select(
      "id,precinctno, firstname,middlename,lastname,birthdate,brgy,completeaddress,purok,city,profession,religion,image,sector",
      {
        count: "exact",
      }
    )
    .filter("isleader", "is", null)
    .filter("isbaco", "is", null)
    .filter("isteam_leader", "is", null)
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
export async function getLeaders({ brgy, page, searchTerm }) {
  let query = supabase
    .from("leaders")
    .select("*", {
      count: "exact",
    })
    .eq("brgy", brgy)
    .order("id", { ascending: false });

  if (searchTerm) {
    query = query.or(
      `lastname.ilike.%${searchTerm}%,firstname.ilike.%${searchTerm}%,middlename.ilike.%${searchTerm}%,brgy.ilike.%${searchTerm}%`
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
    throw new Error("Leaders could not be loaded");
  }

  return { data, count };
}

const checkIfUserExists = async (firstname, lastname, middlename, brgy) => {
  const { data, error } = await supabase
    .from("baco") // Replace with your table name
    .select("id")
    .eq("firstname", firstname)
    .eq("lastname", lastname)
    .eq("middlename", middlename)
    .eq("brgy", brgy);

  if (error) {
    console.error("Error checking for existing user:", error);
    return false;
  }

  return data.length > 0; // Returns true if a match is found, false otherwise
};

export async function createEditLeader(newElectorate, id) {
  // 1. Create/edit cabin
  let query = supabase.from("leaders");

  // A) CREATE
  if (!id) {
    // const userExists = await checkIfUserExists(
    //   newElectorate.firstname,
    //   newElectorate.lastname,
    //   newElectorate.middlename,
    //   newElectorate.brgy
    // );

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
  if (!id) {
    const { error: error3 } = await supabase
      .from("electorates")
      .update({ isteam_leader: true })
      .eq("id", newElectorate.electorate_id);
    if (error3) {
      console.log(error3);
      return null;
    }
  }

  if (error) {
    console.error(error);
    throw new Error(`Leader already exists.`);
    // throw new Error(`Baco could not be created! Error: ${error.message}`);
  }

  return data;
}

export async function deleteLeader({ id, electorate_id }) {
  const { data, error } = await supabase.from("leaders").delete().eq("id", id);
  if (!error) {
    const { error: error3 } = await supabase
      .from("electorates")
      .update({ isteam_leader: null })
      .eq("id", electorate_id);
    if (error3) {
      console.log(error3);
      return null;
    }
  }

  if (error) {
    console.error(error);
    throw new Error("Leader could not be deleted");
  }

  return data;
}

export async function deactivateLeader(id) {
  const { data, error } = await supabase
    .from("leaders")
    .update({ status: "inactive" })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Leader could not be deactivated");
  }

  return data;
}
export async function activateLeader(id) {
  const { data, error } = await supabase
    .from("leaders")
    .update({ status: "active" })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Leader could not be updated");
  }

  return data;
}
