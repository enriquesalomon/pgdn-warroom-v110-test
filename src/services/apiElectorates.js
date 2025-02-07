import { PAGE_SIZE, ato, validationIds } from "../utils/constants";
import supabase, { supabaseUrl } from "./supabase";

export async function fetchAllData(brgy) {
  let data = [];
  let from = 0;
  const limit = 1000;

  while (true) {
    const { data: chunk, error } = await supabase
      .from("electorates")
      .select(
        "id,precinctno, firstname,middlename,lastname,name_ext,birthdate,brgy,purok,city,profession,religion,image,sector"
      )
      .eq("brgy", brgy)
      .range(from, from + limit - 1);

    if (error) {
      throw error;
    }

    if (chunk.length === 0) {
      break;
    }

    data = [...data, ...chunk];
    from += limit;
  }
  console.log("this isx", JSON.stringify(data));
  return data;
}

export async function getElectoratesPer_Brgy2({ brgy, page, searchTerm }) {
  let query = supabase
    .from("electorates")
    .select(
      "id,precinctno, firstname,middlename,lastname,birthdate,brgy,completeaddress,purok,city,profession,religion,image,sector",
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

export async function getUnvalidated_Electorates({ brgy, page, searchTerm }) {
  let query = supabase
    .from("electorates")
    .select(
      "id,precinctno, firstname,middlename,lastname,birthdate,brgy,completeaddress,purok,city,profession,religion,image,sector",
      {
        count: "exact",
      }
    )
    .filter("precinctleader", "is", null)
    .filter("voters_type", "is", null)
    .filter("isbaco", "is", null)
    .filter("is_gm", "is", null)
    .filter("is_agm", "is", null)
    .filter("is_legend", "is", null)
    .filter("is_elite", "is", null)
    .filter("is_pending_team", "is", null)
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

export async function getElectorates_Survey_tag_classification({
  brgy,
  page,
  searchTerm,
}) {
  let query = supabase
    .from("electorates")
    .select(
      "id,precinctno, firstname,middlename,lastname,birthdate,brgy,completeaddress,purok,city,profession,religion,image,sector",
      {
        count: "exact",
      }
    )
    .filter("precinctleader", "is", null)
    .filter("voters_type", "is", null)
    .filter("isbaco", "is", null)
    .filter("is_gm", "is", null)
    .filter("is_agm", "is", null)
    .filter("is_legend", "is", null)
    .filter("is_elite", "is", null)
    .filter("is_pending_team", "is", null)
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
export async function getElectoratesAto({ brgy, page, searchTerm }) {
  let query = supabase
    .from("electorates")
    .select(`*`, {
      count: "exact",
    })
    .eq("brgy", brgy)
    .not("qr_code", "is", null)
    .not("precinctleader", "is", null);
  // .not("qr_code", "is", null)
  // .not("precinctleader", "is", null);

  // .or(`precinctleader.not.is.null,islubas_type.not.null`);
  ///to add condition if 2ndvalidation is true
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
export async function getElectoratesGold({ brgy, page, searchTerm }) {
  let query = supabase
    .from("electorates")
    .select(`*`, {
      count: "exact",
    })
    .eq("brgy", brgy)
    .not("qr_code", "is", null)
    .neq("islubas_type", "N/A");
  // .not("qr_code", "is", null);

  // .not("qr_code", "is", null)
  // .not("precinctleader", "is", null);

  // .or(`precinctleader.not.is.null,islubas_type.not.null`);
  ///to add condition if 2ndvalidation is true
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

export async function getElectorates_Ato_Per_Brgy({ brgy, page, searchTerm }) {
  let query = supabase
    .from("electorates")
    .select(
      "id,precinctno, firstname,middlename,lastname,birthdate,brgy,completeaddress,purok,city,profession,religion,image,sector",
      {
        count: "exact",
      }
    )

    .eq("third_validation", true)
    .eq("brgy", brgy)
    .not("qr_code", "is", null)
    .not("precinctleader", "is", null)
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
//OLD
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
//     // .eq("validation_id", val_id)
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

const checkIfUserExists = async (firstname, lastname, middlename) => {
  const { data, error } = await supabase
    .from("electorates") // Replace with your table name
    .select("id")
    .eq("firstname", firstname)
    .eq("lastname", lastname)
    .eq("middlename", middlename);

  if (error) {
    console.error("Error checking for existing user:", error);
    return false;
  }

  return data.length > 0; // Returns true if a match is found, false otherwise
};

const checkIfInTeam = async (id) => {
  console.log("this isx", id);
  const { data, error } = await supabase
    .from("electorates") // Replace with your table name
    .select("id")
    .eq("id", id)
    .not("precinctleader", "is", null);

  if (error) {
    console.error("Error checking for existing electorates team:", error);
    return false;
  }

  return data.length > 0; // Returns true if a match is found, false otherwise
};

export async function createEditElectorate(newElectorate, id) {
  // Function to generate random text
  const generateRandomText = (length = 10) => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  console.log("value of electorate to edit:", JSON.stringify(newElectorate));
  // Ensure newElectorate.image is defined before accessing its properties
  const hasImagePath = newElectorate.image?.startsWith?.(supabaseUrl);

  let imageName = "";
  let avatarname = "";
  let imagePath = "";

  if (newElectorate.image) {
    imageName = `${Math.random()}-${newElectorate.image.name}`.replaceAll(
      "/",
      ""
    );
    avatarname = `avatars/electorates/${imageName}`;
    imagePath = hasImagePath
      ? newElectorate.image
      : `${supabaseUrl}/storage/v1/object/public/avatars/electorates/${imageName}`;
  }

  // 1. Create/edit electorate
  let query = supabase.from("electorates");

  // A) CREATE
  if (!id) {
    const userExists = await checkIfUserExists(
      newElectorate.firstname,
      newElectorate.lastname,
      newElectorate.middlename
    );

    if (userExists) {
      throw new Error("Data already exists. Not saving data.");
    }

    const newEntry = { ...newElectorate, upload_num: 2 };
    if (newElectorate.image) {
      newEntry.image = imagePath;
      newEntry.avatar = avatarname;
    }

    query = query.insert([newEntry]);
  }

  // A) UPDATE TAG GOLD AFFILIATES
  if (id && newElectorate.islubas_type !== "N/A") {
    const TeamExists = await checkIfInTeam(id);

    if (TeamExists) {
      throw new Error(
        "This electorate is already assigned to a team and cannot be tagged as a Gold Affiliate. Data was not saved."
      );
    }
  }

  // B) EDIT
  if (id) {
    //generate ID
    const randomText = generateRandomText();
    const uniqueQRCodeData = `${randomText}-${id}`; // Concatenate for each memberid

    const updatedEntry = { ...newElectorate, upload_num: 2 };

    if (newElectorate.qr_code === null) {
      updatedEntry.qr_code = uniqueQRCodeData;
    }
    // console.log("this is qr code", newElectorate.qr_code);
    if (newElectorate.image?.name) {
      updatedEntry.image = imagePath;
      updatedEntry.avatar = avatarname;
    }

    query = query.update(updatedEntry).eq("id", id);
    console.log("the new ID:", uniqueQRCodeData);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Electorate could not be created");
  }

  // 2. Upload image
  if (!hasImagePath && newElectorate.image) {
    const { error: storageError } = await supabase.storage
      .from("avatars")
      .upload(`electorates/${imageName}`, newElectorate.image);

    // 3. Delete the electorate IF there was an error uploading image
    if (!id && storageError) {
      await supabase.from("electorates").delete().eq("id", data.id);
      console.error(storageError);
      throw new Error(
        "Electorate image could not be uploaded and the electorate was not created"
      );
    }
  }

  return data;
}

// export async function createEditElectorate(newElectorate, id) {
//   const hasImagePath = newElectorate.image?.startsWith?.(supabaseUrl);

//   const imageName = `${Math.random()}-${newElectorate.image.name}`.replaceAll(
//     "/",
//     ""
//   );
//   const avatarname = `avatars/electorates/${imageName}`;
//   const imagePath = hasImagePath
//     ? newElectorate.image
//     : `${supabaseUrl}/storage/v1/object/public/avatars/electorates/${imageName}`;

//   // 1. Create/edit cabin
//   let query = supabase.from("electorates");

//   // A) CREATE
//   if (!id) {
//     const userExists = await checkIfUserExists(
//       newElectorate.firstname,
//       newElectorate.lastname,
//       newElectorate.middlename
//     );

//     if (userExists) {
//       throw new Error("Data already exists. Not saving data.");
//       // return null;
//     }
//     query = query.insert([
//       { ...newElectorate, image: imagePath, avatar: avatarname, upload_num: 2 },
//     ]);
//   }
//   // A) CREATE
//   // if (!id) query = query.insert([{ ...newElectorate }]);

//   // B) EDIT
//   if (id && newElectorate.image?.name)
//     query = query
//       .update({
//         ...newElectorate,
//         image: imagePath,
//         avatar: avatarname,
//         upload_num: 2,
//       })
//       .eq("id", id);
//   if (id && !newElectorate.image?.name)
//     query = query
//       .update({ ...newElectorate, image: imagePath, upload_num: 2 })
//       .eq("id", id);

//   const { data, error } = await query.select().single();

//   if (error) {
//     console.error(error);
//     throw new Error("Electorate could not be created");
//   }

//   // 2. Upload image
//   if (hasImagePath) return data;

//   const { error: storageError } = await supabase.storage
//     .from("avatars")
//     .upload(`electorates/${imageName}`, newElectorate.image);

//   // 3. Delete the cabin IF there was an error uplaoding image
//   if (!id && storageError) {
//     await supabase.from("electorates").delete().eq("id", data.id);
//     console.error(storageError);
//     throw new Error(
//       "electorates image could not be uploaded and the electorates was not created"
//     );
//   }

//   return data;
// }

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
  if (error) {
    console.error(error);
    throw new Error("electorates could not be loaded");
  }
  return { data, count };
}

export async function getSurveyReport({ result, brgy, page, searchTerm }) {
  brgy = brgy || "BOGAYO";
  let query = supabase
    .from("electorates")
    .select(
      "id,precinctno, firstname,middlename,lastname,birthdate,brgy,completeaddress,purok,survey_tag",
      {
        count: "exact",
      }
    )
    .eq("brgy", brgy)
    // .not("survey_tag", "is", null)
    .order("id", { ascending: false });

  if (result === "ALL") {
    query = query.not("survey_tag", "is", null);
  } else if (result === "UNVALIDATED") {
    query = query.eq("survey_tag", "is", null);
  } else {
    query = query.eq("survey_tag", result);
  }

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
  // const val_id = result || "ATO";

  // const { data, count, error } = await supabase.rpc(
  //   "get_electorate_validated",
  //   { brgy_param: brgy, page: page, searchterm: searchTerm, val_id: val_id }
  // );

  // if (error) console.error(error);
  // if (error) {
  //   console.error(error);
  //   throw new Error("electorates could not be loaded");
  // }
  // return { data, count };
}
// export async function fetchAllData_SurveyReport(brgy) {
//   let data = [];
//   let from = 0;
//   const limit = 1000;

//   while (true) {
//     const { data: chunk, error } = await supabase
//       .from("electorates")
//       .select(
//         "id,precinctno, firstname,middlename,lastname,birthdate,brgy,completeaddress,purok,survey_tag",
//         {
//           count: "exact",
//         }
//       )
//       .eq("brgy", brgy)
//       .range(from, from + limit - 1);

//     if (error) {
//       throw error;
//     }

//     if (chunk.length === 0) {
//       break;
//     }

//     data = [...data, ...chunk];
//     from += limit;
//   }
//   console.log("this isx", JSON.stringify(data));
//   return data;
// }
export async function fetchAllData_SurveyReport(brgy) {
  let data = [];
  let from = 0;
  const limit = 1000;

  while (true) {
    const { data: chunk, error } = await supabase
      .from("electorates")
      .select(
        "id,precinctno,firstname,middlename,lastname,brgy,purok,survey_tag",
        {
          count: "exact",
        }
      )
      .eq("brgy", brgy)
      .neq("survey_tag", null)
      .range(from, from + limit - 1);

    if (error) {
      throw error;
    }

    // Break if no more rows are returned
    if (!chunk || chunk.length === 0) {
      break;
    }

    // Add the fetched chunk to the result
    data = [...data, ...chunk];

    // If fewer rows than the limit are returned, we've reached the end
    if (chunk.length < limit) {
      break;
    }

    from += limit;
  }

  console.log("Fetched data:", JSON.stringify(data));
  return data;
}

export async function getNonTeamClassificationReport({
  validationType,
  result,
  brgy,
  page,
  searchTerm,
}) {
  brgy = brgy || "BOGAYO";
  let query;

  if (validationType === "1v") {
    query = supabase
      .from("electorates")
      .select(
        "id,precinctno, firstname,middlename,lastname,brgy,purok,firstvalidation_tag,secondvalidation_tag,thirdvalidation_tag",
        {
          count: "exact",
        }
      )
      .eq("brgy", brgy)
      .order("id", { ascending: false });

    if (result === "ALL") {
      query = query
        .not("firstvalidation_tag", "is", null)
        .neq("firstvalidation_tag", "OUT OF TOWN")
        .neq("firstvalidation_tag", "ATO");
    } else if (result === "DILI") {
      query = query.eq("firstvalidation_tag", "DILI");
    } else if (result === "INC") {
      query = query.eq("firstvalidation_tag", "INC");
    } else if (result === "JEHOVAH") {
      query = query.eq("firstvalidation_tag", "JEHOVAH");
    } else if (result === "DECEASED") {
      query = query.eq("firstvalidation_tag", "DECEASED");
    } else if (result === "UNDECIDED") {
      query = query.eq("firstvalidation_tag", "UNDECIDED");
    } else if (result === "NVS") {
      query = query.eq("firstvalidation_tag", "NVS");
    }
  }

  if (validationType === "2v") {
    query = supabase
      .from("electorates")
      .select(
        "id,precinctno, firstname,middlename,lastname,birthdate,brgy,completeaddress,purok,secondvalidation_tag,thirdvalidation_tag",
        {
          count: "exact",
        }
      )
      .eq("brgy", brgy)
      .order("id", { ascending: false });
    if (result === "ALL") {
      query = query
        .not("secondvalidation_tag", "is", null)
        .neq("secondvalidation_tag", "OUT OF TOWN")
        .neq("secondvalidation_tag", "ATO");
    } else if (result === "DILI") {
      query = query.eq("secondvalidation_tag", "DILI");
    } else if (result === "INC") {
      query = query.eq("secondvalidation_tag", "INC");
    } else if (result === "JEHOVAH") {
      query = query.eq("secondvalidation_tag", "JEHOVAH");
    } else if (result === "DECEASED") {
      query = query.eq("secondvalidation_tag", "DECEASED");
    } else if (result === "UNDECIDED") {
      query = query.eq("secondvalidation_tag", "UNDECIDED");
    } else if (result === "NVS") {
      query = query.eq("secondvalidation_tag", "NVS");
    }
  }
  if (validationType === "3v") {
    query = supabase
      .from("electorates")
      .select(
        "id,precinctno, firstname,middlename,lastname,birthdate,brgy,completeaddress,purok,thirdvalidation_tag",
        {
          count: "exact",
        }
      )
      .eq("brgy", brgy)
      .order("id", { ascending: false });
    if (result === "ALL") {
      query = query
        .not("thirdvalidation_tag", "is", null)
        .neq("thirdvalidation_tag", "OUT OF TOWN")
        .neq("thirdvalidation_tag", "ATO");
    } else if (result === "DILI") {
      query = query.eq("thirdvalidation_tag", "DILI");
    } else if (result === "INC") {
      query = query.eq("thirdvalidation_tag", "INC");
    } else if (result === "JEHOVAH") {
      query = query.eq("thirdvalidation_tag", "JEHOVAH");
    } else if (result === "DECEASED") {
      query = query.eq("thirdvalidation_tag", "DECEASED");
    } else if (result === "UNDECIDED") {
      query = query.eq("thirdvalidation_tag", "UNDECIDED");
    } else if (result === "NVS") {
      query = query.eq("thirdvalidation_tag", "NVS");
    }
  }

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
  console.log("here in reports survey", JSON.stringify(data));

  if (error) {
    console.error(error);
    throw new Error("electorates could not be loaded");
  }
  return { data, count };
}
export async function fetchAllData_NonTeamClassificationReport({
  brgy,
  validationType,
}) {
  brgy = brgy || "BOGAYO";

  if (validationType === "1v") {
    let data = [];
    let from = 0;
    const limit = 1000;

    while (true) {
      const { data: chunk, error } = await supabase
        .from("electorates")
        .select(
          "id,precinctno,lastname, firstname,middlename,brgy,purok,firstvalidation_tag,secondvalidation_tag,thirdvalidation_tag",
          {
            count: "exact",
          }
        )
        .eq("brgy", brgy)
        .not("firstvalidation_tag", "is", null)
        .neq("firstvalidation_tag", "OUT OF TOWN")
        .neq("firstvalidation_tag", "ATO")
        .order("id", { ascending: false })
        .range(from, from + limit - 1);

      if (error) {
        throw error;
      }

      // Break if no more rows are returned
      if (!chunk || chunk.length === 0) {
        break;
      }

      // Add the fetched chunk to the result
      data = [...data, ...chunk];

      // If fewer rows than the limit are returned, we've reached the end
      if (chunk.length < limit) {
        break;
      }

      from += limit;
    }

    console.log("Fetched data:", JSON.stringify(data));
    return data;
  }
  if (validationType === "2v") {
    let data = [];
    let from = 0;
    const limit = 1000;

    while (true) {
      const { data: chunk, error } = await supabase
        .from("electorates")
        .select(
          "id,precinctno, firstname,middlename,lastname,brgy,purok,firstvalidation_tag,secondvalidation_tag,thirdvalidation_tag",
          {
            count: "exact",
          }
        )
        .eq("brgy", brgy)
        .not("secondvalidation_tag", "is", null)
        .neq("secondvalidation_tag", "OUT OF TOWN")
        .neq("secondvalidation_tag", "ATO")
        .order("id", { ascending: false })
        .range(from, from + limit - 1);

      if (error) {
        throw error;
      }

      // Break if no more rows are returned
      if (!chunk || chunk.length === 0) {
        break;
      }

      // Add the fetched chunk to the result
      data = [...data, ...chunk];

      // If fewer rows than the limit are returned, we've reached the end
      if (chunk.length < limit) {
        break;
      }

      from += limit;
    }

    console.log("Fetched data:", JSON.stringify(data));
    return data;
  }
  if (validationType === "3v") {
    let data = [];
    let from = 0;
    const limit = 1000;

    while (true) {
      const { data: chunk, error } = await supabase
        .from("electorates")
        .select(
          "id,precinctno, firstname,middlename,lastname,brgy,purok,firstvalidation_tag,secondvalidation_tag,thirdvalidation_tag",
          {
            count: "exact",
          }
        )
        .eq("brgy", brgy)
        .not("thirdvalidation_tag", "is", null)
        .neq("thirdvalidation_tag", "OUT OF TOWN")
        .neq("thirdvalidation_tag", "ATO")
        .order("id", { ascending: false })
        .range(from, from + limit - 1);

      if (error) {
        throw error;
      }

      // Break if no more rows are returned
      if (!chunk || chunk.length === 0) {
        break;
      }

      // Add the fetched chunk to the result
      data = [...data, ...chunk];

      // If fewer rows than the limit are returned, we've reached the end
      if (chunk.length < limit) {
        break;
      }

      from += limit;
    }

    console.log("Fetched data:", JSON.stringify(data));
    return data;
  }
}
export async function getAffiliates({ filterby, brgy, page, searchTerm }) {
  const filteredtype = filterby;
  console.log("FILTER TYPE:", filterby);
  let query = supabase
    .from("electorates")
    .select(
      "id,precinctno,lastname, firstname,middlename,birthdate,brgy,completeaddress,purok,islubas_type",
      {
        count: "exact",
      }
    )
    .eq("brgy", brgy)
    .order("id", { ascending: false });

  if (filteredtype === "ALL") {
    query = query.neq("islubas_type", "N/A");
  } else {
    query = query.eq("islubas_type", filteredtype);
  }

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
export async function fetchAllData_getAffiliates(brgy) {
  let data = [];
  let from = 0;
  const limit = 1000;

  while (true) {
    const { data: chunk, error } = await supabase
      .from("electorates")
      .select(
        "precinctno,lastname, firstname,middlename,brgy,purok,islubas_type",
        {
          count: "exact",
        }
      )
      .eq("brgy", brgy)
      .neq("islubas_type", "N/A")
      .order("id", { ascending: false })
      .range(from, from + limit - 1);

    if (error) {
      throw error;
    }

    // Break if no more rows are returned
    if (!chunk || chunk.length === 0) {
      break;
    }

    // Add the fetched chunk to the result
    data = [...data, ...chunk];

    // If fewer rows than the limit are returned, we've reached the end
    if (chunk.length < limit) {
      break;
    }

    from += limit;
  }

  console.log("Fetched data:", JSON.stringify(data));
  return data;
}

export async function getLeaders({ filterby, brgy, page, searchTerm }) {
  const filteredtype = filterby || "ALL";
  let query = supabase
    .from("electorates")
    .select(
      "id,precinctno, firstname,middlename,lastname,name_ext,birthdate,brgy,completeaddress,purok,isleader_type",
      {
        count: "exact",
      }
    )
    .eq("brgy", brgy)
    // .eq("isleader_type", filteredtype)
    .order("id", { ascending: false });

  if (filteredtype === "ALL") {
    query = query
      .not("isleader_type", "is", null)
      .not("isleader_type", "eq", "HOUSEHOLD MEMBER");
    // query = query
    //   .not("isleader_type", "is", null)
    //   .not("isleader_type", "is", "HOUSEHOLD MEMBER");
  } else {
    query = query.eq("isleader_type", filteredtype);
  }
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
    "get_electorate_ato_unscanned_monitoring",
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
  const PAGE_SIZE = 100;
  let query = supabase
    .from("voters_scans")
    .select(
      `*,team (firstname,lastname),electorates (firstname,lastname,middlename,precinctno,purok,precinctleader,isleader,isbaco,is_gm,is_agm,is_legend,is_elite)`,
      {
        count: "exact",
      }
    )

    // .not("qr_code", "is", null)
    .eq("brgy", brgy)
    .order("created_at", { ascending: false });
  // let query = supabase
  //   .from("electorates")
  //   .select(
  //     `id,precinctno,firstname,middlename,lastname,purok,brgy,team (firstname,lastname)`,
  //     {
  //       count: "exact",
  //     }
  //   )
  //   .is("final_validation", true)
  //   // .not("qr_code", "is", null)
  //   .eq("brgy", brgy)
  //   .order("created_at", { ascending: false });

  // if (searchTerm) {
  //   query = query.or(
  //     `lastname.ilike.%${searchTerm}%,firstname.ilike.%${searchTerm}%,middlename.ilike.%${searchTerm}%`
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
    throw new Error("electorates could not be loaded");
  }

  return { data, count };
}

export async function getElectorates_Classification({
  assigned,
  brgy,
  page,
  searchTerm,
}) {
  let query = supabase
    .from("electorates")
    .select(
      `id,precinctno,firstname,middlename,lastname,purok,brgy,voters_type,isleader_type,team (firstname,lastname,baco_name,gm_name,agm_name,legend_name,elite_name)`,
      {
        count: "exact",
      }
    )
    .eq("brgy", brgy)
    .order("created_at", { ascending: false });

  if (assigned === "0") {
    console.log("diri 0");
    query = query
      .is("precinctleader", null)
      .is("voters_type", null)
      .is("isbaco", null)
      .is("is_gm", null)
      .is("is_agm", null)
      .is("is_legend", null)
      .is("is_elite", null);
  } else if (assigned === "1") {
    query = query.not("precinctleader", "is", null);
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
    console.log("errorr", JSON.stringify(error));
    throw new Error("electorates could not be loaded");
  }

  return { data, count };
}

export async function fetchAllData_Electorates_Classification({
  brgy,
  assigned,
}) {
  let data = [];
  let from = 0;
  const limit = 1000;

  while (true) {
    let query = supabase
      .from("electorates")
      .select(
        `id,precinctno,firstname,middlename,lastname,purok,brgy,voters_type,team (firstname,lastname,baco_name,gm_name,agm_name,legend_name,elite_name)`,
        {
          count: "exact",
        }
      )
      .eq("brgy", brgy)
      .order("created_at", { ascending: false });

    if (assigned === "0") {
      query = query.is("precinctleader", null).is("voters_type", null);
    } else if (assigned === "1") {
      query = query.not("precinctleader", "is", null);
    } else if (assigned === "4") {
      query = query.eq("voters_type", "OT");
    } else if (assigned === "5") {
      query = query.eq("voters_type", "INC");
    } else if (assigned === "6") {
      query = query.eq("voters_type", "JEHOVAH");
    } else {
      query = query.not("precinctleader", "is", null);
    }
    query = query.range(from, from + limit - 1);

    // if (assigned === "0") {
    //   query = query.is("precinctleader", null).range(from, from + limit - 1);
    // } else if (assigned === "1") {
    //   query = query
    //     .not("precinctleader", "is", null)
    //     .range(from, from + limit - 1);
    // } else {
    //   query = query
    //     .not("precinctleader", "is", null)
    //     .range(from, from + limit - 1);
    // }

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

export async function getSectors() {
  let query = supabase
    .from("sector")
    .select("name")
    .order("name", { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("sector could not be loaded");
  }
  return data;
}

export async function getAllElectorates_for_non_team_validation_tag({
  brgy,
  precint,
  page,
}) {
  console.log("pasdasdasd", precint);
  let query = supabase
    .from("electorates")
    .select(
      "id,precinctno, firstname,middlename,lastname,name_ext,purok,firstvalidation_tag,secondvalidation_tag,thirdvalidation_tag,islubas_type",
      {
        count: "exact",
      }
    )
    .eq("brgy", brgy)
    // .neq("islubas_type", "N/A")
    .is("precinctleader", null)
    .order("precinctno", { ascending: true }) // First order by precinctno
    .order("lastname", { ascending: true }); // Then order by lastname

  if (precint !== "ALL PRECINCT") {
    query = query.eq("precinctno", precint);
  }
  if (page) {
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
