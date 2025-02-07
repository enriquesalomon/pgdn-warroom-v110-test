import { PAGE_SIZE, ato, validationIds } from "../utils/constants";
import supabase from "./supabase";

export async function getSpecialElectorate({
  assigned,
  brgy,
  page,
  searchTerm,
}) {
  let query = supabase
    .from("electorates")
    .select(
      `id,precinctno,firstname,middlename,lastname,purok,brgy,voters_type`,
      {
        count: "exact",
      }
    )
    .eq("brgy", brgy)
    .order("id", { ascending: false });

  if (assigned === "0") {
    query = query.not("voters_type", "is", null);
  } else if (assigned === "4") {
    query = query.eq("voters_type", "OT");
  } else if (assigned === "5") {
    query = query.eq("voters_type", "INC");
  } else if (assigned === "6") {
    query = query.eq("voters_type", "JEHOVAH");
  } else {
    query = query.not("precinctleader", "is", null);
  }

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

export async function createEditSpecial(newUserData) {
  let tag_result;
  if (newUserData.voters_type === "OT") {
    tag_result = 4;
  } else if (newUserData.voters_type === "INC") {
    tag_result = 5;
  } else if (newUserData.voters_type === "JEHOVAH") {
    tag_result = 6;
  }

  // Construct the object to insert
  const dataToInsert = {
    electorate_id: newUserData.id, // Insert array element into electorate_id
    leader_id: null,
    result: tag_result,
    validation_id: newUserData.val_id,
    brgy: newUserData.brgy,
    confirmed_by: newUserData.confirmed_by,
  };

  // Insert into electorate_validations table
  const { data, error } = await supabase
    .from("electorate_validations")
    .insert([dataToInsert])
    .select();

  if (error) {
    console.error(error);
    throw new Error(
      "Cannot proceed with tagging. The selected electorates have already been tagged."
    );
  } else {
    console.log("success insterted electorate_validations", data);
  }

  try {
    // Update the electorates table
    const { data: updateData, error: updateError } = await supabase
      .from("electorates")
      .update({ voters_type: newUserData.voters_type })
      .eq("id", newUserData.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating data:", updateError);

      // Rollback: Delete the previously inserted record in electorate_validations
      const { error: rollbackError } = await supabase
        .from("electorate_validations")
        .delete()
        .eq("id", data[0].id); // Assuming data[0] contains the inserted row

      if (rollbackError) {
        console.error("Rollback failed:", rollbackError);
        throw new Error(`Error during rollback: ${rollbackError.message}`);
      }

      throw new Error(`Error in Tagging! Error: ${updateError.message}`);
    } else {
      console.log("Data updated successfully:", updateData);
    }

    return data;
  } catch (error) {
    console.error("Unexpected error:", error);
    throw new Error("An unexpected error occurred during processing.");
  }
}

export async function untagSpecial(id) {
  const { data, error } = await supabase
    .from("electorates")
    .update({ voters_type: null })
    .eq("id", id)
    // .eq("final_validation", false)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Untagging Failed");
  }

  const { error: err1 } = await supabase
    .from("electorate_validations")
    .delete()
    .eq("electorate_id", id);

  if (err1) {
    console.error(err1);
    throw new Error("Someting went wrong in deleting electorate_validations");
  }
  return data;
}

// export async function getElectoratesAto({
//   filter,
//   brgy,
//   page,
//   searchTerm,
//   validationType,
// }) {
//   const val_id = validationIds[validationType];
//   let query = supabase
//     .from("electorate_validations")
//     .select(
//       `*,settings_validation (validation_name), electorates (precinctno,firstname,middlename,lastname,brgy,purok,completeaddress,qr_code,avatar), team (firstname, lastname)`,
//       {
//         count: "exact",
//       }
//     )
//     .eq("validation_id", val_id)
//     .eq("brgy", brgy)
//     .eq("result", ato)
//     .order("created_at", { ascending: false });

//   if (searchTerm) {
//     query = query.or(
//       `lastname.ilike.%${searchTerm}%,firstname.ilike.%${searchTerm}%,middlename.ilike.%${searchTerm}%`
//     );
//   }

//   if (!searchTerm && page) {
//     const from = (page - 1) * PAGE_SIZE;
//     const to = from + PAGE_SIZE - 1;
//     query = query.range(from, to);
//   }

//   const { data, error, count } = await query;

//   if (error) {
//     console.error(error);
//     throw new Error("electorates could not be loaded");
//   }
//   return { data, count };
// }

export async function getElectoratesPerBrgy({ brgy }) {
  let query = supabase.from("electorates").select("*").eq("brgy", brgy);
  // .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Leaders could not be loaded");
  }

  return data;
}

export async function getBacoAll() {
  let query = supabase
    .from("baco")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  // FILTER
  // if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

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

export async function createEditBaco(newElectorate, id) {
  // 1. Create/edit cabin
  let query = supabase.from("baco");

  // A) CREATE
  if (!id) {
    const userExists = await checkIfUserExists(
      newElectorate.firstname,
      newElectorate.lastname,
      newElectorate.middlename,
      newElectorate.brgy
    );

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
    throw new Error(`Baco already exists.`);
    // throw new Error(`Baco could not be created! Error: ${error.message}`);
  }

  return data;
}

export async function deleteElectorate(id) {
  const { data, error } = await supabase
    .from("electorates")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Electorates could not be deleted");
  }

  return data;
}

export async function getElectorateValidated({
  validationType,
  brgy,
  page,
  searchTerm,
}) {
  const val_id = validationIds[validationType] || 1;

  const { data, count, error } = await supabase.rpc(
    "get_electorate_validated",
    { brgy_param: brgy, page: page, searchterm: searchTerm, val_id: val_id }
  );

  if (error) console.error(error);
  else console.log("data_rpc", data);
  if (error) {
    console.error(error);
    throw new Error("electorates could not be loaded");
  }
  return { data, count };
}

export async function getVoterAto_Unscanned(validationType) {
  const val_id = validationIds[validationType];

  const { data, error } = await supabase
    .from("electorate_validations")
    .select(
      `team (firstname,lastname), electorates (precinctno,firstname,middlename,lastname,brgy,purok)`
    )
    .not("electorates.final_validation", "eq", true)
    .eq("validation_id", val_id)
    .eq("result", ato)

    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    throw new Error("Electorates could not be loaded");
  }

  return data;
}

export async function getList_UnscannedAto({
  brgy,
  page,
  searchTerm,
  validationType,
}) {
  const val_id = validationIds[validationType] || 3;

  const { data, count, error } = await supabase.rpc(
    "get_electorate_ato_unscanned",
    { brgy_param: brgy, page: page, searchterm: searchTerm, val_id: val_id }
  );

  if (error) console.error(error);
  else console.log("data_rpc getElectorates_uNSCANNED", data);
  if (error) {
    console.error(error);
    throw new Error("electorates could not be loaded");
  }
  return { data, count };
}

export async function getList_ScannedAto({ brgy, page, searchTerm }) {
  let query = supabase
    .from("electorates")
    .select(
      `id,precinctno,firstname,middlename,lastname,purok,brgy,team (firstname,lastname)`,
      {
        count: "exact",
      }
    )
    .eq("final_validation", true)
    .not("qr_code", "is", null)
    .eq("brgy", brgy)
    .order("created_at", { ascending: false });

  if (searchTerm) {
    query = query.or(
      `lastname.ilike.%${searchTerm}%,firstname.ilike.%${searchTerm}%,middlename.ilike.%${searchTerm}%`
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

export async function deactivateBaco(id) {
  const { data, error } = await supabase
    .from("baco")
    .update({ status: "inactive" })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Baco successfully deactivated");
  }

  return data;
}

export async function activateBaco(id) {
  const { data, error } = await supabase
    .from("baco")
    .update({ status: "active" })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Baco could not be updated");
  }

  return data;
}

export async function deleteBaco(id) {
  const { data, error } = await supabase.from("baco").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Baco could not be deleted");
  }

  return data;
}
