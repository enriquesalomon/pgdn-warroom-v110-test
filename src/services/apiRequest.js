import { PAGE_SIZE } from "../utils/constants";
import supabase from "./supabase";

export async function checkRequest() {
  let query = supabase
    .from("requests")
    .select("*")
    .eq("request_status", "PENDING");

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Requests could not be loaded");
  }
  return { data };
}
export async function getRequest({ request_status, page, searchTerm, brgy }) {
  const isAscending = request_status === "PENDING" ? true : false;
  let query = supabase
    .from("requests")
    .select(
      `*,baco (firstname, middlename,lastname,brgy),electorates(precinctno,firstname,lastname)`,
      {
        count: "exact",
      }
    )
    .eq("brgy", brgy)
    .order("created_at", { ascending: isAscending });

  if (request_status === "PENDING") {
    query = query.eq("request_status", "PENDING");
  } else {
    query = query.neq("request_status", "PENDING");
  }

  if (searchTerm) {
    query = query.or(
      `request_id.ilike.%${searchTerm}%,request_type.ilike.%${searchTerm}%,request_status.ilike.%${searchTerm}%`
    );
  }

  if (!searchTerm && page) {
    const from = (page - 1) * 50;
    const to = from + 50 - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Requests could not be loaded");
  }
  return { data, count };
}

export async function getCheckRequest() {
  let query = supabase
    .from("requests")
    .select("id", {
      count: "exact",
    })
    .eq("request_status", "PENDING");

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Requests could not be loaded");
  }
  return { data, count };
}

export async function getCheck() {
  let query = supabase
    .from("requests")
    .select(`id`, {
      count: "exact",
    })
    .eq("request_status", "PENDING");

  const { data, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("Requests could not be loaded");
  }
  return { count, data };
}

export async function getElectorate(leader_id) {
  let query = supabase
    .from("electorates")
    .select("id,precinctno,firstname,middlename,lastname,brgy")
    .eq("id", leader_id);
  const { data, error } = await query;
  if (error) {
    console.error(error);
    throw new Error("Electorates could not be loaded");
  }

  return data;
}
export async function getElectorateNames(mem_id) {
  let query = supabase
    .from("electorates")
    .select("id, firstname,middlename,lastname,precinctno")
    .in("id", mem_id); // Use the `in` operator to query multiple IDs
  const { data, error } = await query;
  if (error) {
    console.error(error);
    throw new Error("Electorates could not be loaded");
  }

  return data;
}

export async function getCheckTeam(team_id) {
  let query = supabase.from("team").select("id").eq("electorate_id", team_id); // Use the `in` operator to query multiple IDs
  const { data, error } = await query;
  if (error) {
    console.error(error);
    throw new Error("Team could not be found has error");
  }

  return data;
}

export async function getOriginamMembers(team_id) {
  let query = supabase
    .from("electorates")
    .select("id, firstname,middlename,lastname,precinctno")
    .eq("precinctleader", team_id); // Use the `in` operator to query multiple IDs
  const { data, error } = await query;
  if (error) {
    console.error(error);
    throw new Error("Electorates could not be loaded");
  }
  return data;
}
export async function getTeamData(leader_id) {
  let query = supabase.from("team").select("*").eq("electorate_id", leader_id); // Use the `in` operator to query multiple IDs
  const { data, error } = await query;
  if (error) {
    console.error(error);
    throw new Error("team could not be loaded");
  }

  return data;
}

export async function getValidationSettings() {
  const { data, error } = await supabase
    .from("settings_validation")
    .select("*")
    .eq("isactive", true)
    .order("id", { ascending: true });

  if (error) {
    console.error(error);
    throw new Error("Validation Settings could not be loaded");
  }
  return data;
}

export async function approveTeam_add_Request(newLeader) {
  console.log("xxxx", JSON.stringify(newLeader));
  let confirmed_by = newLeader.added_by;
  let editid = newLeader.id;
  let teamleader_id = newLeader.electorate_id;
  let baco_id = newLeader.baco_id;
  let req_type = newLeader.request_type;
  let brgy = newLeader.barangay;
  let val_id = newLeader.val_id;
  delete newLeader.confirmed_by;
  delete newLeader.id;
  delete newLeader.middlename;
  delete newLeader.baco_id;
  delete newLeader.request_code;
  delete newLeader.request_type;
  delete newLeader.val_id;
  delete newLeader.elite_precinctno;
  delete newLeader.legend_precinctno;

  //---------------------------------------------MEMBERS TABLE
  //ADD TEAM
  //Insert members to the Members Table to Enforce if values in the electorate_id id unique across rows and if not unique Throws Error to Avoid Data Duplication

  for (let element of newLeader.members) {
    const mem_params = {
      team_id: null, // Insert array element into electorate_id
      electorate_id: element,
    };

    const { error } = await supabase.from("members").insert([mem_params]);

    if (error) {
      console.error("Error inserting data:", error);
      throw new Error(
        "Cannot proceed in creation of this team. Some selected members have already been assigned in other team."
      );
    }
  }
  //---------------------------------------------MEMBERS TABLE

  // //inserting new team
  const { data, error_add } = await supabase
    .from("team")
    .insert([{ ...newLeader }])
    .select();
  if (error_add) {
    console.error("xxx", error_add);
    throw new Error("Leader could not be created");
  }

  let team_id = data[0].id;

  //if no error then updating request status
  const { error: err1_add } = await supabase
    .from("requests")
    .update({
      request_status: "APPROVED",
      confirmed_by: confirmed_by,
      confirmed_at: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Manila",
      }),
    })
    .eq("id", editid);
  if (err1_add) {
    console.log(err1_add);
    throw new Error("Updating Request failed");
  }

  // //if no error then updating members precinctleader =team id
  const { error: err2_add } = await supabase
    .from("electorates")
    .update({ precinctleader: data[0].id, is_pending_team: null })
    .in("id", newLeader.members);
  if (err2_add) {
    console.log(err2_add);
    return null;
  }
  //update the electorate leader isleader true
  const { error: err3_add } = await supabase
    .from("electorates")
    .update({ isleader: true, is_pending_team: null })
    .eq("id", newLeader.electorate_id);
  if (err3_add) {
    console.log(err3_add);
    return null;
  }

  try {
    for (let element of newLeader.members) {
      // Construct the object to insert
      const dataToInsert = {
        electorate_id: element, // Insert array element into electorate_id
        leader_id: team_id,
        result: 1,
        validation_id: val_id,
        brgy: brgy,
        confirmed_by: confirmed_by,
      };

      const { data, error } = await supabase
        .from("electorate_validations")
        .insert([dataToInsert]);

      if (error) {
        console.error("Error inserting data:", error);
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }

  //---------------------------------------------------- MEMBERS TABLE

  //CREATE TEAM
  //update members team_id after saving data to team table
  const { erroe: error1 } = await supabase
    .from("members")
    .update({ team_id: team_id })
    .in("electorate_id", newLeader.members);
  if (error1) {
    console.log(error1);
    return null;
  }

  // // // insert noti
  const params = {
    baco_id: baco_id,
    request_id: newLeader.request_id,
    content: "Team Creation",
    request_type: req_type,
    is_read: false,
    request_status: "APPROVED",
  };

  const { error: err4 } = await supabase
    .from("notification")
    .insert({ ...params });
  if (err4) {
    console.log(err4);
    return null;
  }
}

export async function approveMem_remarks_Request(newLeader) {
  let confirmed_by = newLeader.added_by;
  let reqid = newLeader.id;
  let baco_id = newLeader.baco_id;
  let request_type = newLeader.request_type;
  let members_id = newLeader.members_id_toremove;
  let content = newLeader.content;
  let val_id = newLeader.val_id;
  let barangay = newLeader.barangay;

  const voters_type =
    request_type === "OUT OF TOWN"
      ? "OT"
      : request_type === "INC"
      ? "INC"
      : request_type === "JEHOVAH"
      ? "JEHOVAH"
      : "";
  const voters_result =
    request_type === "OUT OF TOWN"
      ? 4
      : request_type === "INC"
      ? 5
      : request_type === "JEHOVAH"
      ? 6
      : "";

  for (let element of members_id) {
    // Construct the object to insert
    const dataToInsert = {
      electorate_id: element, // Insert array element into electorate_id
      leader_id: null,
      result: voters_result,
      validation_id: val_id,
      brgy: barangay,
      confirmed_by: confirmed_by,
    };

    const { error } = await supabase
      .from("electorate_validations")
      .insert([dataToInsert]);

    if (error) {
      // console.error("Error inserting data:", error);
      throw new Error(
        "Cannot proceed with tagging. The selected electorates have already been tagged."
      );
    }
  }

  // update requests
  const { error: err1_dl } = await supabase
    .from("requests")
    .update({
      request_status: "APPROVED",
      confirmed_by: confirmed_by,
      confirmed_at: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Manila",
      }),
    })
    .eq("id", reqid);
  if (err1_dl) {
    console.log(err1_dl);
    throw new Error("Updating Request failed");
  }

  //update electorates
  const { error: err2_dl } = await supabase
    .from("electorates")
    .update({
      voters_type: voters_type,
      is_pending_team: null,
    })
    .in("id", members_id);
  if (err2_dl) {
    console.log(err2_dl);
    throw new Error("Updating Electorates failed");
  }

  // try {
  //   for (let element of members_id) {
  //     // Construct the object to insert
  //     const dataToInsert = {
  //       electorate_id: element, // Insert array element into electorate_id
  //       leader_id: null,
  //       result: voters_result,
  //       validation_id: val_id,
  //       brgy: barangay,
  //       confirmed_by: confirmed_by,
  //     };

  //     const { error } = await supabase
  //       .from("electorate_validations")
  //       .insert([dataToInsert]);

  //     if (error) {
  //       console.error("Error inserting data:", error);
  //     }
  //   }
  // } catch (error) {
  //   console.error("Unexpected error:", error);
  // }

  // insert noti
  const params = {
    baco_id: baco_id,
    request_id: newLeader.request_id,
    content: content,
    request_type: request_type,
    is_read: false,
    request_status: "APPROVED",
  };

  const { error: err4 } = await supabase
    .from("notification")
    .insert({ ...params });
  if (err4) {
    console.log(err4);
    return null;
  }
}
export async function approveTeam_delist_Request(newLeader) {
  let confirmed_by = newLeader.added_by;
  let reqid = newLeader.id;
  let baco_id = newLeader.baco_id;
  let req_type = newLeader.request_type;
  let team_id = newLeader.team_id;
  let members_id_toremove = newLeader.members_id_toremove;
  let content = newLeader.content;
  let val_id = newLeader.val_id;

  // update requests
  const { error: err1_dl } = await supabase
    .from("requests")
    .update({
      request_status: "APPROVED",
      confirmed_by: confirmed_by,
      confirmed_at: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Manila",
      }),
    })
    .eq("id", reqid);
  if (err1_dl) {
    console.log(err1_dl);
    throw new Error("Updating Request failed");
  }
  //update team
  const { error: err3_dl } = await supabase
    .from("team")
    .update({
      members: newLeader.members,
      members_name: newLeader.members_name,
    })
    .eq("id", team_id);

  if (err3_dl) {
    console.log(err3_dl);
    throw new Error("Updating Electorates failed");
  }

  //update electorates
  const { error: err2_dl } = await supabase
    .from("electorates")
    .update({
      precinctleader: null,
      is_pending_team: null,
    })
    .in("id", members_id_toremove);
  if (err2_dl) {
    console.log(err2_dl);
    throw new Error("Updating Electorates failed");
  }

  //delete electoratesvalidation record
  const { error: err4_dl } = await supabase
    .from("electorate_validations")
    .delete()
    .in("electorate_id", members_id_toremove);
  if (err4_dl) {
    console.log(err4_dl);
    throw new Error("Updating Electorates validation failed");
  }

  //---------------------------------------------------- MEMBERS TABLE
  const { error: err5_dl } = await supabase
    .from("members")
    .delete()
    .in("electorate_id", members_id_toremove);
  if (err5_dl) {
    console.log(err5_dl);
    throw new Error("Updating Electorates failed");
  }
  //---------------------------------------------------- MEMBERS TABLE
  // insert noti
  const params = {
    baco_id: baco_id,
    request_id: newLeader.request_id,
    content: content,
    request_type: req_type,
    is_read: false,
    request_status: "APPROVED",
  };

  const { error: err4 } = await supabase
    .from("notification")
    .insert({ ...params });
  if (err4) {
    console.log(err4);
    return null;
  }
}
export async function approveTeam_listing_Request(newLeader) {
  let confirmed_by = newLeader.added_by;
  let reqid = newLeader.id;
  let baco_id = newLeader.baco_id;
  let req_type = newLeader.request_type;
  let team_id = newLeader.team_id;
  let members_id_toadd = newLeader.members_id_toadd;
  let content = newLeader.content;
  let brgy = newLeader.barangay;
  let val_id = newLeader.val_id;

  //---------------------------------------------MEMBERS TABLE
  //ADD MEMBERS
  //Insert members to the Members Table to Enforce if values in the electorate_id id unique across rows and if not unique Throws Error to Avoid Data Duplication

  for (let element of members_id_toadd) {
    const mem_params = {
      team_id: null, // Insert array element into electorate_id
      electorate_id: element,
    };

    const { error } = await supabase.from("members").insert([mem_params]);

    if (error) {
      console.error("Error inserting data:", error);
      throw new Error("Creation failed: Please retry");
    }
  }
  //---------------------------------------------MEMBERS TABLE

  // update requests
  const { error: err1_dl } = await supabase
    .from("requests")
    .update({
      request_status: "APPROVED",
      confirmed_by: confirmed_by,
      confirmed_at: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Manila",
      }),
    })
    .eq("id", reqid);
  if (err1_dl) {
    console.log(err1_dl);
    throw new Error("Updating Request failed");
  }
  // update team
  const { error: err3_dl } = await supabase
    .from("team")
    .update({
      members: newLeader.members,
      members_name: newLeader.members_name,
    })
    .eq("id", team_id);

  if (err3_dl) {
    console.log(err3_dl);
    throw new Error("Updating Team failed");
  }

  // update electorates
  const { error: err2_dl } = await supabase
    .from("electorates")
    .update({
      precinctleader: team_id[0],
      is_pending_team: null,
    })
    .in("id", members_id_toadd);
  if (err2_dl) {
    console.log(err2_dl);
    throw new Error("Updating Electorates failed");
  }

  try {
    for (let element of members_id_toadd) {
      // Construct the object to insert
      const dataToInsert = {
        electorate_id: element, // Insert array element into electorate_id
        leader_id: team_id[0],
        result: 1,
        validation_id: val_id,
        brgy: brgy,
        confirmed_by: confirmed_by,
      };

      const { error } = await supabase
        .from("electorate_validations")
        .insert([dataToInsert]);

      if (error) {
        console.error("Error inserting data:", error);
      }
    }
  } catch (error) {
    console.error("Unexpected error:", error);
  }

  //---------------------------------------------------- MEMBERS TABLE

  //CREATE TEAM team_id[0]
  //update members team_id after saving data to team table
  const { erroe: error1 } = await supabase
    .from("members")
    .update({ team_id: team_id[0] })
    .in("electorate_id", members_id_toadd);
  if (error1) {
    console.log(error1);
    return null;
  }

  //---------------------------------------------------- MEMBERS TABLE

  // insert noti
  const params = {
    baco_id: baco_id,
    request_id: newLeader.request_id,
    content: content,
    request_type: req_type,
    is_read: false,
    request_status: "APPROVED",
  };

  const { error: err4 } = await supabase
    .from("notification")
    .insert({ ...params });
  if (err4) {
    console.log(err4);
    return null;
  }
}

export async function disapproveTeam_Request(editData, id) {
  const { error: err2_add } = await supabase
    .from("electorates")
    .update({ is_pending_team: null })
    .in("id", editData.members);
  if (err2_add) {
    console.log(err2_add);
    return null;
  }
  const { error: err1 } = await supabase
    .from("requests")
    .update({
      request_status: "DISAPPROVED",
      confirmed_by: editData.added_by,
      remarks: editData.remarks,
      confirmed_at: new Date().toLocaleString("en-US", {
        timeZone: "Asia/Manila",
      }),
    })
    .eq("id", id);
  if (err1) {
    console.log(err1);
    throw new Error("Updating Request failed");
  }
  //insert noti
  const params = {
    baco_id: editData.baco_id,
    request_id: editData.request_id,
    content: editData.content,
    request_type: editData.request_type,
    is_read: false,
    request_status: "DISAPPROVED",
    request_remarks: editData.remarks,
  };
  const { error: err2 } = await supabase
    .from("notification")
    .insert({ ...params });
  if (err2) {
    console.log(err2);
    return null;
  }
}
