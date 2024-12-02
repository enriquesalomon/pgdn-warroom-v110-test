import { PAGE_SIZE } from "../utils/constants";
import supabase from "./supabase";

//
export async function getBaco({ brgy = null, page, searchTerm }) {
  let query = supabase
    .from("baco")
    .select(
      "id,firstname,middlename,lastname,contactno,gender,brgy,status,added_by,electorate_id",
      {
        count: "exact",
      }
    )
    .order("id", { ascending: false });
  if (brgy !== null) {
    query.eq("brgy", brgy);
  }
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
    throw new Error("baco could not be loaded");
  }

  return { data, count };
}
//
export async function createEditBacoUser(newUserData, id) {
  //removing the team property inside the newUserData
  if ("baco" in newUserData) {
    delete newUserData.baco;
  }

  let query = supabase.from("users");

  if (id) query = query.update({ ...newUserData }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("User could not be updated");
  }

  return data;
}

//
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
//
export async function createEditBaco(newElectorate, id) {
  let query = supabase.from("baco");

  try {
    // A) CREATE
    if (!id) {
      const { data, error } = await query
        .insert([{ ...newElectorate }])
        .select()
        .single();
      if (error) {
        throw new Error(`Baco already exists.`);
      }
      // Update `isbaco` in `electorates` table
      const { error: errorUpdate } = await supabase
        .from("electorates")
        .update({ isbaco: true })
        .eq("id", newElectorate.electorate_id);

      if (errorUpdate) {
        // Rollback the insert in `baco` table if updating `electorates` fails
        await supabase.from("baco").delete().eq("id", data.id);
        throw errorUpdate;
      }

      return data;
    }

    // B) EDIT
    if (id) {
      const { data, error } = await query
        .update({ ...newElectorate })
        .eq("id", id);
      if (error) {
        throw error;
      }

      return data;
    }
  } catch (error) {
    console.error("Error in createEditBaco:", error);
    throw new Error("An error occurred while processing the request.");
  }
}
// old without rollback mechanism
// export async function createEditBaco(newElectorate, id) {
//   // 1. Create/edit cabin
//   let query = supabase.from("baco");

//   // A) CREATE
//   if (!id) {
//     const userExists = await checkIfUserExists(
//       newElectorate.firstname,
//       newElectorate.lastname,
//       newElectorate.middlename,
//       newElectorate.brgy
//     );

//     // if (userExists) {
//     //   throw new Error("Data already exists. Not saving data.");
//     //   // return null;
//     // }
//     query = query.insert([{ ...newElectorate }]);
//   }
//   // A) CREATE
//   // if (!id) query = query.insert([{ ...newElectorate }]);

//   // B) EDIT
//   if (id)
//     query = query
//       .update({
//         ...newElectorate,
//       })
//       .eq("id", id);

//   const { data, error } = await query.select().single();
//   if (!id) {
//     const { error: error3 } = await supabase
//       .from("electorates")
//       .update({ isbaco: true })
//       .eq("id", newElectorate.electorate_id);
//     if (error3) {
//       console.log(error3);
//       return null;
//     }
//   }

//   if (error) {
//     console.error(error);
//     throw new Error(`Baco already exists.`);
//     // throw new Error(`Baco could not be created! Error: ${error.message}`);
//   }

//   return data;
// }

//
export async function deactivateBaco(id) {
  const { data, error } = await supabase
    .from("baco")
    .update({ status: "inactive" })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Baco could not be deactivated");
  }

  return data;
}
//
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
//

const checkIfHasManyRecords = async (id) => {
  const { data, error } = await supabase
    .from("team") // Replace with your table name
    .select("id")
    .eq("baco_id", id);
  if (error) {
    console.error("Error checking for existing sector:", error);
    return false;
  }

  return data.length > 0; // Returns true if a match is found, false otherwise
};
export async function deleteBaco({ id, electorate_id }) {
  const baco_hasRecords = await checkIfHasManyRecords(id);

  if (baco_hasRecords) {
    throw new Error("This Baco is cannot be deleted, Existing Records Found.");
  }
  const { data, error } = await supabase.from("baco").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Baco could not be deleted");
  }
  const { error: error3 } = await supabase
    .from("electorates")
    .update({ isbaco: null })
    .eq("id", electorate_id);
  if (error3) {
    console.log(error3);
    return null;
  }

  return data;
}
///
export async function getElectorates_forBaco({ brgy, page, searchTerm }) {
  let query = supabase
    .from("electorates")
    .select(
      "id,precinctno, firstname,middlename,lastname,birthdate,brgy,completeaddress,purok,city,profession,religion,image,sector",
      {
        count: "exact",
      }
    )
    .eq("brgy", brgy)
    .is("precinctleader", null)
    .is("voters_type", null)
    .is("isbaco", null)
    .is("is_gm", null)
    .is("is_agm", null)
    .is("is_legend", null)
    .is("is_elite", null)
    .is("is_pending_team", null)
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

// export async function deleteElectorate(id) {
//   const { data, error } = await supabase
//     .from("electorates")
//     .delete()
//     .eq("id", id);

//   if (error) {
//     console.error(error);
//     throw new Error("Electorates could not be deleted");
//   }

//   return data;
// }

// export async function getElectorateValidated({
//   validationType,
//   brgy,
//   page,
//   searchTerm,
// }) {
//   const val_id = validationIds[validationType] || 1;

//   const { data, count, error } = await supabase.rpc(
//     "get_electorate_validated",
//     { brgy_param: brgy, page: page, searchterm: searchTerm, val_id: val_id }
//   );

//   if (error) console.error(error);
//   if (error) {
//     console.error(error);
//     throw new Error("electorates could not be loaded");
//   }
//   return { data, count };
// }

// export async function getVoterAto_Unscanned(validationType) {
//   const val_id = validationIds[validationType];

//   const { data, error } = await supabase
//     .from("electorate_validations")
//     .select(
//       `team (firstname,lastname), electorates (precinctno,firstname,middlename,lastname,brgy,purok)`
//     )
//     .not("electorates.final_validation", "eq", true)
//     .eq("validation_id", val_id)
//     .eq("result", ato)

//     .order("created_at", { ascending: false });

//   if (error) {
//     console.error(error);
//     throw new Error("Electorates could not be loaded");
//   }

//   return data;
// }

// export async function getList_UnscannedAto({
//   brgy,
//   page,
//   searchTerm,
//   validationType,
// }) {
//   const val_id = validationIds[validationType] || 3;

//   const { data, count, error } = await supabase.rpc(
//     "get_electorate_ato_unscanned",
//     { brgy_param: brgy, page: page, searchterm: searchTerm, val_id: val_id }
//   );

//   if (error) console.error(error);

//   if (error) {
//     console.error(error);
//     throw new Error("electorates could not be loaded");
//   }
//   return { data, count };
// }

// export async function getList_ScannedAto({ brgy, page, searchTerm }) {
//   let query = supabase
//     .from("electorates")
//     .select(
//       `id,precinctno,firstname,middlename,lastname,purok,brgy,team (firstname,lastname)`,
//       {
//         count: "exact",
//       }
//     )
//     .eq("final_validation", true)
//     .not("qr_code", "is", null)
//     .eq("brgy", brgy)
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

// export async function getElectoratesPerBrgy({ brgy }) {
//   let query = supabase.from("electorates").select("*").eq("brgy", brgy);
//   // .order("created_at", { ascending: false });

//   const { data, error } = await query;

//   if (error) {
//     console.error(error);
//     throw new Error("Leaders could not be loaded");
//   }

//   return data;
// }
