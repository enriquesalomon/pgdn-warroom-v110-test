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
        "id,precinctno, firstname,middlename,lastname,birthdate,brgy,completeaddress,purok,city,profession,religion,image,sector"
      )
      .eq("brgy", brgy)
      .order("precinctno", { ascending: true }) // First order by precinctno
      .order("lastname", { ascending: true }) // Then order by lastname
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
export async function getElectoratesAto({ brgy, page, searchTerm }) {
  let query = supabase
    .from("electorates")
    .select(`*`, {
      count: "exact",
    })
    .eq("brgy", brgy)
    .not("qr_code", "is", null)
    .or(
      `precinctleader.not.is.null,isbaco.eq.true,is_gm.eq.true,is_agm.eq.true,is_legend.eq.true,is_elite.eq.true`
    );
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
export async function getElectoratesIDCard({
  brgy,
  printed_status,
  id_requirments,
  page,
  searchTerm,
  voter_type,
}) {
  let query = supabase
    .from("electorates")
    .select(`*`, {
      count: "exact",
    })
    .eq("brgy", brgy)
    .order("lastname", { ascending: true });

  if (printed_status === "printed") {
    query = query.eq("id_printed_status", true);
    console.log("printed------xx");
  }
  if (printed_status === "unprinted") {
    query = query.eq("id_printed_status", false);
    console.log("unprinted------xx");
  }

  if (id_requirments === "complete") {
    query = query
      .not("image", "is", null)
      .not("signature", "is", null)
      .not("qr_code_url", "is", null)
      .not("asenso_color_code_url", "is", null);
    console.log("complete------xx");
  }
  if (id_requirments === "incomplete") {
    query = query.or(`image.is.null,signature.is.null,qr_code_url.is.null`);
    // query = query.or(
    //   `image.not.is.null,signature.not.is.null,qr_code_url.not.is.null`
    // );
    console.log("incomplete------xx");
  }

  //this voter_type is not used due to filtering of ID card set in the colorcode
  // switch (voter_type) {
  //   case "gm":
  //     query = query.eq("is_gm", true);
  //     break;
  //   case "agm":
  //     query = query.eq("is_agm", true);
  //     break;
  //   case "legend":
  //     query = query.eq("is_legend", true);
  //     break;
  //   case "elite":
  //     query = query.eq("is_elite", true);
  //     break;
  //   case "tower":
  //     query = query.eq("isleader", true);
  //     break;
  //   case "warrior":
  //     query = query.not("precinctleader", "is", null);
  //     break;
  //   default:
  //     // Optional: handle unexpected cases
  //     break;
  // }
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
  // if (printed_status !== "all") {
  //   query = query.eq("id_printed_status", print_stats);
  // }
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

export async function createEditElectorate(newElectorate, id) {
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

  // B) EDIT
  if (id) {
    const updatedEntry = { ...newElectorate, upload_num: 2 };
    if (newElectorate.image?.name) {
      updatedEntry.image = imagePath;
      updatedEntry.avatar = avatarname;
    }

    query = query.update(updatedEntry).eq("id", id);
  }

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Electorate could not be created");
  }

  // 2. Upload image
  if (!hasImagePath && newElectorate.image) {
    // const { error: storageError } = await supabase.storage
    //   .from("avatars")
    //   .upload(`electorates/${imageName}`, newElectorate.image);
    // 3. Delete the electorate IF there was an error uploading image
    // if (!id && storageError) {
    //   await supabase.from("electorates").delete().eq("id", data.id);
    //   console.error(storageError);
    //   throw new Error(
    //     "Electorate image could not be uploaded and the electorate was not created"
    //   );
    // }
    console.log(
      "this is the upload image to bucket,imageName :",
      newElectorate.image
    );
  }

  return data;
}
//this is working
// export async function createEditElectorate(newElectorate, id) {
//   // Ensure newElectorate.image is defined before accessing its properties
//   const hasImagePath = newElectorate.image?.startsWith?.(supabaseUrl);

//   let imageName = "";
//   let avatarname = "";
//   let imagePath = "";

//   if (newElectorate.image) {
//     imageName = `${Math.random()}-${newElectorate.image.name}`.replaceAll(
//       "/",
//       ""
//     );
//     avatarname = `avatars/electorates/${imageName}`;
//     imagePath = hasImagePath
//       ? newElectorate.image
//       : `${supabaseUrl}/storage/v1/object/public/avatars/electorates/${imageName}`;
//   }

//   // 1. Create/edit electorate
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
//     }

//     const newEntry = { ...newElectorate, upload_num: 2 };
//     if (newElectorate.image) {
//       newEntry.image = imagePath;
//       newEntry.avatar = avatarname;
//     }

//     query = query.insert([newEntry]);
//   }

//   // B) EDIT
//   if (id) {
//     const updatedEntry = { ...newElectorate, upload_num: 2 };
//     if (newElectorate.image?.name) {
//       updatedEntry.image = imagePath;
//       updatedEntry.avatar = avatarname;
//     }

//     query = query.update(updatedEntry).eq("id", id);
//   }

//   const { data, error } = await query.select().single();

//   if (error) {
//     console.error(error);
//     throw new Error("Electorate could not be created");
//   }

//   // 2. Upload image
//   if (!hasImagePath && newElectorate.image) {
//     const { error: storageError } = await supabase.storage
//       .from("avatars")
//       .upload(`electorates/${imageName}`, newElectorate.image);

//     // 3. Delete the electorate IF there was an error uploading image
//     if (!id && storageError) {
//       await supabase.from("electorates").delete().eq("id", data.id);
//       console.error(storageError);
//       throw new Error(
//         "Electorate image could not be uploaded and the electorate was not created"
//       );
//     }
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

export async function getList_UnscannedAto({ brgy, page, searchTerm }) {
  const PAGE_SIZE = 100;
  let query = supabase
    .from("electorates")
    .select(
      `id,precinctno,firstname,middlename,lastname,purok,brgy,team (firstname,lastname)`,
      {
        count: "exact",
      }
    )
    .is("final_validation", false)
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

// OLD
// export async function getList_UnscannedAto({
//   brgy,
//   page,
//   searchTerm,
//   validationType,
// }) {
//   const val_id = validationIds[validationType] || 3;

//   const { data, count, error } = await supabase.rpc(
//     "get_electorate_ato_unscanned",
//     { brgy_param: brgy, page: page, searchterm: searchTerm }
//   );

//   if (error) console.error(error);
//   if (error) {
//     console.error(error);
//     throw new Error("electorates could not be loaded");
//   }
//   return { data, count };
// }

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
      `id,precinctno,firstname,middlename,lastname,purok,brgy,voters_type,team (firstname,lastname,baco_name,gm_name,agm_name,legend_name,elite_name)`,
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
