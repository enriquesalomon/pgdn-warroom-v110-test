import { PAGE_SIZE } from "../utils/constants";
import supabase from "./supabase";

export async function getTeams() {
  let query = supabase
    .from("team")
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

export async function getTeamsWithMembers({ filter, brgy }) {
  let query = supabase
    .from("team")
    .select("*", { count: "exact" })
    .eq("barangay", brgy)
    .not("members", "is", null)
    .order("created_at", { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Leaders could not be loaded");
  }

  return { data, count };
}

//--this is a version1
// export async function createEditTeam(
//   newLeader,
//   id,
//   deleteMembersid,
//   new_membersId
// ) {
//   let val_id = newLeader.val_id;
//   delete newLeader.val_id;
//   const { electorate_id, members } = newLeader;
//   let query = supabase.from("team");
//   // A) CREATE
//   // in creating new team
//   if (!id) query = query.insert([{ ...newLeader }]);
//   // B) EDIT
//   if (id) query = query.update({ ...newLeader }).eq("id", id);
//   const { data: leaderData, error } = await query.select().single();
//   if (error) {
//     console.error(error);
//     throw new Error(
//       "Creation failed: The selected leader is already assigned to another team."
//     );
//     // throw new Error(
//     //   `Team could not be created, something went wrong! Error: ${error.message}`
//     // );
//   }
//   const newLeaderId = leaderData.id;
//   // const ids = [...members, electorate_id];

//   if (!id) {
//     // in creating new team
//     //update the electorates precintleader id
//     const { erroe: error1 } = await supabase
//       .from("electorates")
//       .update({ precinctleader: newLeaderId })
//       .in("id", members);
//     if (error1) {
//       console.log(error1);
//       return null;
//     }
//     //update the electorates isleader true
//     const { error: error2 } = await supabase
//       .from("electorates")
//       .update({ isleader: true })
//       .eq("id", electorate_id);
//     if (error2) {
//       console.log(error2);
//       return null;
//     }
//   }

//   if (!id) {
//     // in creating new team
//     // //INSERT DATA TO ELECTORATE VALIDATION TABLE
//     try {
//       for (let element of members) {
//         // Construct the object to insert
//         const dataToInsert = {
//           electorate_id: element, // Insert array element into electorate_id
//           leader_id: newLeaderId,
//           result: 1,
//           validation_id: val_id,
//           brgy: newLeader.barangay,
//           confirmed_by: newLeader.added_by,
//         };

//         const { data, error } = await supabase
//           .from("electorate_validations")
//           .insert([dataToInsert]);

//         if (error) {
//           console.error("Error inserting data:", error);
//           throw new Error(
//             `Team could not be created, something went wrong! Error: ${error.message}`
//           );
//         } else {
//           console.log("Data inserted successfully:", data);
//         }
//       }
//     } catch (error) {
//       console.error("Unexpected error:", error);
//     }
//   }

//   //updating to removed membersid in electorate table
//   if (id && deleteMembersid.length > 0) {
//     //update the electorates precintleader=null of removed members
//     const { error3 } = await supabase
//       .from("electorates")
//       .update({ precinctleader: null })
//       .in("id", deleteMembersid);
//     if (error3) {
//       console.log(error3);
//       return null;
//     }
//   }
//   //updating to new added membersid in electorate table
//   if (id && new_membersId.length > 0) {
//     //update the electorates precintleader id of new added members
//     const { error4 } = await supabase
//       .from("electorates")
//       .update({ precinctleader: id })
//       .in("id", new_membersId);
//     if (error4) {
//       console.log(error4);
//       return null;
//     }
//   }

//   // removed membersid in Validation Table
//   if (id && deleteMembersid.length > 0) {
//     //delete electoratesvalidation record
//     const { error: err4_dl } = await supabase
//       .from("electorate_validations")
//       .delete()
//       .in("electorate_id", deleteMembersid);
//     if (err4_dl) {
//       console.log(err4_dl);
//       throw new Error("Updating Electorates validation failed");
//     }
//   }
//   //inserting to new added membersid in Validation Table
//   if (id && new_membersId.length > 0) {
//     try {
//       for (let element of new_membersId) {
//         // Construct the object to insert
//         const dataToInsert = {
//           electorate_id: element, // Insert array element into electorate_id
//           leader_id: id,
//           result: 1,
//           validation_id: null,
//           brgy: newLeader.barangay,
//         };

//         const { data, error } = await supabase
//           .from("electorate_validations")
//           .insert([dataToInsert]);

//         if (error) {
//           console.error("Error inserting data:", error);
//         } else {
//           console.log("Data inserted successfully:", data);
//         }
//       }
//     } catch (error) {
//       console.error("Unexpected error:", error);
//     }
//   }
// }

// SAMPLE ROLLBACK MECHANISM
// async function updateElectors(newLeaderId, members, electorate_id) {
//   try {
//     const { error: error1 } = await supabase
//       .from("electorates")
//       .update({ precinctleader: newLeaderId })
//       .in("id", members);

//     if (error1) {
//       console.error("Error updating electorates:", error1);
//       throw error1; // Re-throw the error to trigger the rollback
//     }

//     const { error: error2 } = await supabase
//       .from("electorates")
//       .update({ isleader: true })
//       .eq("id", electorate_id);

//     if (error2) {
//       console.error("Error updating electorate leader:", error2);
//       throw error2; // Re-throw the error to trigger the rollback
//     }

//     return { success: true }; // Both updates were successful
//   } catch (error) {
//     // Handle errors and perform rollback if necessary
//     console.error("Error during update:", error);

//     // Rollback logic (if applicable):
//     // Rollback logic (if applicable):
//     try {
//       // Undo the changes made in the successful update (if any)
//       await supabase
//         .from("electorates")
//         .update({ precinctleader: previousLeaderId })
//         .in("id", members);
//       await supabase
//         .from("electorates")
//         .update({ isleader: false })
//         .eq("id", electorate_id);
//     } catch (rollbackError) {
//       console.error("Error during rollback:", rollbackError);
//     }

//     return { success: false, error };
//   }
// }
//--this is a version2
export async function createEditTeam(
  newLeader,
  id,
  deleteMembersid,
  new_membersId
) {
  let val_id = newLeader.val_id;
  delete newLeader.val_id;
  const { electorate_id, members } = newLeader;

  //---------------------------------------------MEMBERS TABLE
  //ADD TEAM
  //Insert members to the Members Table to Enforce if values in the electorate_id id unique across rows and if not unique Throws Error to Avoid Data Duplication
  let array_mems;
  if (id) {
    array_mems = new_membersId;
  } else {
    array_mems = members;
  }

  for (let element of array_mems) {
    const mem_params = {
      team_id: null, // Insert array element into electorate_id
      electorate_id: element,
    };

    const { data: data_mem, error } = await supabase
      .from("members")
      .insert([mem_params]);

    if (error) {
      console.error("Error inserting data:", error);
      throw new Error("Creation failed: Please retry");
    } else {
      console.log("Data inserted successfully:", JSON.stringify(data_mem));
    }
  }
  //---------------------------------------------MEMBERS TABLE

  //------------------------------------------------------------------
  let query = supabase.from("team");
  // A) CREATE
  // in creating new team
  if (!id) query = query.insert([{ ...newLeader }]);
  // B) EDIT
  if (id) query = query.update({ ...newLeader }).eq("id", id);
  const { data: leaderData, error } = await query.select().single();
  if (error) {
    console.error(error);
    throw new Error(
      "Creation failed: The selected leader is already assigned to another team."
    );
    // throw new Error(
    //   `Team could not be created, something went wrong! Error: ${error.message}`
    // );
  }
  const newLeaderId = leaderData.id;

  if (!id) {
    // in creating new team
    //update the electorates precintleader id
    const { erroe: error1 } = await supabase
      .from("electorates")
      .update({ precinctleader: newLeaderId })
      .in("id", members);
    if (error1) {
      console.log(error1);
      return null;
    }
    //update the electorates isleader true
    const { error: error2 } = await supabase
      .from("electorates")
      .update({ isleader: true })
      .eq("id", electorate_id);

    //update gm
    const { error: error3 } = await supabase
      .from("electorates")
      .update({ is_gm: true })
      .eq("id", newLeader.gm_id);
    if (error3) {
      console.log(error3);
      return null;
    }
    //update agm
    const { error: error4 } = await supabase
      .from("electorates")
      .update({ is_agm: true })
      .eq("id", newLeader.agm_id);
    if (error4) {
      console.log(error4);
      return null;
    }
    //update legend
    const { error: error5 } = await supabase
      .from("electorates")
      .update({ is_legend: true })
      .eq("id", newLeader.legend_id);
    if (error5) {
      console.log(error5);
      return null;
    }
    //update elite
    const { error: error6 } = await supabase
      .from("electorates")
      .update({ is_elite: true })
      .eq("id", newLeader.elite_id);
    if (error6) {
      console.log(error6);
      return null;
    }
  }

  if (!id) {
    // in creating new team
    // //INSERT DATA TO ELECTORATE VALIDATION TABLE
    try {
      for (let element of members) {
        // Construct the object to insert
        const dataToInsert = {
          electorate_id: element, // Insert array element into electorate_id
          leader_id: newLeaderId,
          result: 1,
          validation_id: val_id,
          brgy: newLeader.barangay,
          confirmed_by: newLeader.added_by,
        };

        const { data, error } = await supabase
          .from("electorate_validations")
          .insert([dataToInsert]);

        if (error) {
          console.error("Error inserting data:", error);
          throw new Error(
            `Team could not be created, something went wrong! Error: ${error.message}`
          );
        } else {
          console.log("Data inserted successfully:", data);
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }

  //updating to removed membersid in electorate table
  if (id && deleteMembersid.length > 0) {
    //update the electorates precintleader=null of removed members
    const { error3 } = await supabase
      .from("electorates")
      .update({ precinctleader: null })
      .in("id", deleteMembersid);
    if (error3) {
      console.log(error3);
      return null;
    }
  }
  //updating to new added membersid in electorate table
  if (id && new_membersId.length > 0) {
    //update the electorates precintleader id of new added members
    const { error4 } = await supabase
      .from("electorates")
      .update({ precinctleader: id })
      .in("id", new_membersId);
    if (error4) {
      console.log(error4);
      return null;
    }
  }

  // removed membersid in Validation Table
  if (id && deleteMembersid.length > 0) {
    //delete electoratesvalidation record
    const { error: err4_dl } = await supabase
      .from("electorate_validations")
      .delete()
      .in("electorate_id", deleteMembersid);
    if (err4_dl) {
      console.log(err4_dl);
      throw new Error("Updating Electorates validation failed");
    }
  }
  //inserting to new added membersid in Validation Table
  if (id && new_membersId.length > 0) {
    try {
      for (let element of new_membersId) {
        // Construct the object to insert
        const dataToInsert = {
          electorate_id: element, // Insert array element into electorate_id
          leader_id: id,
          result: 1,
          validation_id: val_id,
          brgy: newLeader.barangay,
        };

        const { data, error } = await supabase
          .from("electorate_validations")
          .insert([dataToInsert]);

        if (error) {
          console.error("Error inserting data:", error);
        } else {
          console.log("Data inserted successfully:", data);
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    }
  }

  //---------------------------------------------------- MEMBERS TABLE
  if (!id) {
    //ADD TEAM
    //update members team_id after saving data to team table
    const { erroe: error1 } = await supabase
      .from("members")
      .update({ team_id: newLeaderId })
      .in("electorate_id", members);
    if (error1) {
      console.log(error1);
      return null;
    }
  }
  if (id && new_membersId.length > 0) {
    //EDIT TEAM
    //update members team_id after saving data to team table
    const { erroe: error1 } = await supabase
      .from("members")
      .update({ team_id: id })
      .in("electorate_id", members);
    if (error1) {
      console.log(error1);
      return null;
    }
  }
  if (id && deleteMembersid.length > 0) {
    //EDIT TEAM
    //delete members record of the deleteMembersid
    const { error: err4_dl } = await supabase
      .from("members")
      .delete()
      .in("electorate_id", deleteMembersid);
    if (err4_dl) {
      console.log(err4_dl);
      throw new Error("Updating Members Table failed");
    }
  }
  //---------------------------------------------------- MEMBERS TABLE
}

const checkIfHasManyRecords = async (electorate_id, id, column_field) => {
  console.log("gm_id", electorate_id);
  console.log("id", id);
  const { data, error } = await supabase
    .from("team") // Replace with your table name
    .select("id")
    .eq(column_field, electorate_id)
    .neq("id", id);
  if (error) {
    console.error("Error checking for existing sector:", error);
    return false;
  }

  return data.length > 0; // Returns true if a match is found, false otherwise
};
export async function deleteTeam({
  id,
  electorate_id,
  gm_id,
  agm_id,
  legend_id,
  elite_id,
}) {
  console.log("zzzid", id);
  console.log("xxid", electorate_id);
  const { data, error } = await supabase.from("team").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Team could not be deleted");
  }

  const { error: err_update } = await supabase
    .from("electorates")
    .update({
      isleader: null,
      first_validation: false,
      second_validation: false,
      third_validation: false,
      final_validation: false,
    })
    .eq("id", electorate_id);

  if (err_update) {
    console.error(err_update);
    throw new Error("Team could not be deleted");
  }

  // -------------------------
  // checking the leadersif has other records when deleting the current team, if no other record found then update the electorate
  // is_gm,is_agm,is_legend,is_elite
  const gm_manyRecords = await checkIfHasManyRecords(gm_id, id, "gm_id");
  const agm_manyRecords = await checkIfHasManyRecords(agm_id, id, "agm_id");
  const legend_manyRecords = await checkIfHasManyRecords(
    legend_id,
    id,
    "legend_id"
  );
  const elite_manyRecords = await checkIfHasManyRecords(
    elite_id,
    id,
    "elite_id"
  );
  if (!gm_manyRecords) {
    //then update the electorates
    console.log("wala na laen");
    await supabase
      .from("electorates")
      .update({
        is_gm: null,
      })
      .eq("id", gm_id);
  } else {
    console.log("naa laen");
  }

  if (!agm_manyRecords) {
    //then update the electorates
    console.log("wala na laen");
    await supabase
      .from("electorates")
      .update({
        is_agm: null,
      })
      .eq("id", agm_id);
  } else {
    console.log("naa laen");
  }

  if (!legend_manyRecords) {
    //then update the electorates
    console.log("wala na laen");
    await supabase
      .from("electorates")
      .update({
        is_legend: null,
      })
      .eq("id", legend_id);
  } else {
    console.log("naa laen");
  }

  if (!elite_manyRecords) {
    //then update the electorates
    console.log("wala na laen");
    await supabase
      .from("electorates")
      .update({
        is_elite: null,
      })
      .eq("id", elite_id);
  } else {
    console.log("naa laen");
  }

  // -------------------------

  return data;
}

export async function deactivateTeam(id) {
  const { data, error } = await supabase
    .from("team")
    .update({ status: "inactive" })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Team successfully deactivated");
  }

  return data;
}

export async function activateTeam(id) {
  const { data, error } = await supabase
    .from("team")
    .update({ status: "active" })
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Team could not be updated");
  }

  return data;
}

export async function getElectorates_forLeaders({ brgy, page, searchTerm }) {
  let query = supabase
    .from("electorates")
    .select(
      "id,precinctno, firstname,middlename,lastname,brgy,purok,is_gm,is_agm,is_legend,is_elite",
      {
        count: "exact",
      }
    )
    .filter("precinctleader", "is", null)
    .filter("voters_type", "is", null)
    .filter("isbaco", "is", null)
    .not("is_gm", "is", true)
    .not("is_agm", "is", true)
    .not("is_legend", "is", true)
    .not("is_elite", "is", true)
    .not("is_pending_team", "is", true)
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
//---------BELOW ARE THE FUNCTIONS FOR REPORTING

export async function getTeamList({ brgy, page, searchTerm }) {
  let query = supabase
    .from("team")
    .select(`*`, {
      count: "exact",
    })
    .eq("barangay", brgy)
    .order("created_at", { ascending: false });

  // if (assigned === "0") {
  //   query = query.is("precinctleader", null).is("voters_type", null);
  // } else if (assigned === "1") {
  //   query = query.not("precinctleader", "is", null);
  // } else if (assigned === "4") {
  //   query = query.eq("voters_type", "OT");
  // } else if (assigned === "5") {
  //   query = query.eq("voters_type", "INC");
  // } else if (assigned === "6") {
  //   query = query.eq("voters_type", "JEHOVAH");
  // } else {
  //   query = query.not("precinctleader", "is", null);
  // }

  if (searchTerm) {
    query = query.or(
      `lastname.ilike.%${searchTerm}%,firstname.ilike.%${searchTerm}%,gm_name.ilike.%${searchTerm}%,agm_name.ilike.%${searchTerm}%,legend_name.ilike.%${searchTerm}%,elite_name.ilike.%${searchTerm}%,baco_name.ilike.%${searchTerm}%,precinctno.ilike.%${searchTerm}%`
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

export async function fetchAllData_Team_List({ brgy }) {
  let data = [];
  let from = 0;
  const limit = 1000;

  while (true) {
    let query = supabase
      .from("team")
      .select(`*`, {
        count: "exact",
      })
      .eq("barangay", brgy)
      .order("created_at", { ascending: false });

    query = query.range(from, from + limit - 1);

    const { data: chunk, error } = await query;

    if (error) {
      throw error;
    }

    if (chunk.length === 0) {
      break;
    }

    data = [...data, ...chunk];
    from += limit;
    // If the number of rows fetched is less than the limit, we know we are at the end
    if (chunk.length < limit) {
      break;
    }
  }

  return data;
}

export async function getTeams_per_TopLeaders({ topleader_id, leader_type }) {
  console.log("getTeams_per_TopLeaders", topleader_id);

  let column_target;
  if (leader_type === "GRAND MASTER") {
    column_target = "gm_id";
  }

  if (leader_type === "ASSISTANT GRAND MASTER") {
    column_target = "agm_id";
  }
  if (leader_type === "LEGEND") {
    column_target = "legend_id";
  }
  if (leader_type === "ELITE") {
    column_target = "elite_id";
  }

  let query = supabase
    .from("team")
    .select("*", { count: "exact" })
    .eq(column_target, topleader_id)
    .order("id", { ascending: true });

  // FILTER
  // if (filter) query = query[filter.method || "eq"](filter.field, filter.value);

  const { data, error, count } = await query;
  if (error) {
    console.error(error);
    throw new Error("Leaders could not be loaded");
  }

  return { data, count };
}
