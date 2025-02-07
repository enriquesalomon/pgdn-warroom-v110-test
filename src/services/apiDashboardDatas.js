import supabase from "./supabase";
import {
  validationMapping,
  validationIds,
  ato,
  dili,
  undecided,
  scanned_voted,
  deceased,
  outoftown,
  inc,
  jehovah,
} from "../utils/constants";

export async function getCountElectorates() {
  const { error, count } = await supabase
    .from("electorates")
    .select("id", { count: "exact" });
  if (error) {
    console.error(error);
    throw new Error("Electorates could not be loaded");
  }
  return { count };
}
export async function getCountValidated(validationType) {
  const val_id = validationIds[validationType] || 1;

  const { error, count } = await supabase
    .from("electorate_validations")
    .select("id", { count: "exact" });
  // .eq("validation_id", val_id);
  if (error) {
    console.error(error);
    throw new Error("getCountValidated could not be loaded");
  }
  return { count };
}

export async function getCountUnValidated(validationType) {
  const condition = validationMapping[validationType] || "first_validation";

  const { error, count } = await supabase
    .from("electorates")
    .select("id", { count: "exact" })
    .not(condition, "is", true);
  if (error) {
    console.error(error);
    throw new Error("Electorates could not be loaded");
  }
  return { count };
}

export async function getCountAto(validationType) {
  const val_id = validationIds[validationType] || 1;
  const { error, count } = await supabase
    .from("electorate_validations")
    .select("id", { count: "exact" })
    .eq("result", ato);
  // .eq("validation_id", val_id);
  if (error) {
    console.error(error);
    throw new Error("Counting Ato could not be loaded");
  }
  return { count };
}
export async function getCountAto_VotersMonitoring(validationType) {
  let count = 0;
  const val_id = validationIds[validationType] || 1;
  const { error, count: count_warriorsTowers } = await supabase
    .from("electorate_validations")
    .select("*", { count: "exact" })
    .eq("result", ato);
  const { count: count_topLeaders } = await supabase
    .from("electorates")
    .select("*", { count: "exact" })
    .or(
      `isbaco.eq.true,is_gm.eq.true,is_agm.eq.true,is_legend.eq.true,is_elite.eq.true`
    );

  count = count_warriorsTowers + count_topLeaders;
  if (error) {
    console.error(error);
    throw new Error("Counting Ato could not be loaded");
  }
  return { count };
}

export async function getCountDili(validationType) {
  const val_id = validationIds[validationType] || 1;
  //VERSION 4
  const { error, count } = await supabase
    .from("electorates")
    .select("id", { count: "exact" })
    .filter("precinctleader", "is", null)
    .filter("voters_type", "is", null)
    .filter("isbaco", "is", null)
    .filter("is_gm", "is", null)
    .filter("is_agm", "is", null)
    .filter("is_legend", "is", null)
    .filter("is_elite", "is", null);
  //VERSION 3
  // const { error, count } = await supabase
  //   .from("electorates")
  //   .select("id", { count: "exact" })
  //   .is("precinctleader", null)
  //   .is("voters_type", null);

  if (error) {
    console.error(error);
    throw new Error("Counting dili could not be loaded");
  }
  return { count };
}

export async function getCountUndecided(validationType) {
  const val_id = validationIds[validationType] || 1;
  const { error, count } = await supabase
    .from("electorate_validations")
    .select("id", { count: "exact" })
    .eq("result", undecided)
    .eq("validation_id", val_id);
  if (error) {
    console.error(error);
    throw new Error("Counting undecided could not be loaded");
  }
  return { count };
}

export async function getCountDeceased(validationType) {
  const val_id = validationIds[validationType] || 1;
  const { error, count } = await supabase
    .from("electorate_validations")
    .select("id", { count: "exact" })
    .eq("result", deceased)
    .eq("validation_id", val_id);
  if (error) {
    console.error(error);
    throw new Error("Counting deceased could not be loaded");
  }
  return { count };
}

export async function getCountOT(validationType) {
  const val_id = validationIds[validationType] || 1;
  const { error, count } = await supabase
    .from("electorate_validations")
    .select("id", { count: "exact" })
    .eq("result", outoftown);
  // .eq("validation_id", val_id);
  if (error) {
    console.error(error);
    throw new Error("Counting OT could not be loaded");
  }
  return { count };
}
export async function getCountINC(validationType) {
  const val_id = validationIds[validationType] || 1;
  const { error, count } = await supabase
    .from("electorate_validations")
    .select("id", { count: "exact" })
    .eq("result", inc);
  // .eq("validation_id", val_id);
  if (error) {
    console.error(error);
    throw new Error("Counting inc could not be loaded");
  }

  return { count };
}
export async function getCountJEHOVAH(validationType) {
  const val_id = validationIds[validationType] || 1;
  const { error, count } = await supabase
    .from("electorate_validations")
    .select("id", { count: "exact" })
    .eq("result", jehovah);
  // .eq("validation_id", val_id);
  if (error) {
    console.error(error);
    throw new Error("Counting jehovah could not be loaded");
  }
  return { count };
}

export async function getCountPerBrgy() {
  const { data, error } = await supabase.rpc(
    "get_voters_scanned_count_by_brgy"
  );

  if (error) {
    console.error(error);
    throw new Error("getCountPerBrgy Ato could not be loaded");
  }
  return { data };
}

export async function getCountPerBrgy_Unvalidated(validationType) {
  const val_id = validationIds[validationType] || 1;
  const { data, error } = await supabase.rpc("count_electorates_unvalidated");

  if (error) {
    console.error(error);
    throw new Error("getCountPerBrgy Ato could not be loaded");
  }
  return { data };
}

// below is the functions use for fetching datas in Voters Monitoring
export async function getCount3rdV_ato(validationType) {
  const val_id = validationIds[validationType] || 1;
  const { error, count } = await supabase
    .from("electorate_validations")
    .select("id", { count: "exact" })
    .eq("result", ato)
    .eq("validation_id", val_id);
  if (error) {
    console.error(error);
    throw new Error("getCount3rdV_ato could not be loaded");
  }
  return { count };
}

export async function getCountScanned(validationType) {
  const val_id = validationIds[validationType] || 1;
  const { error, count } = await supabase
    .from("voters_scans")
    .select("id", { count: "exact" });

  if (error) {
    console.error(error);
    throw new Error("getCountScanned  could not be loaded");
  }
  return { count };
}

export async function getLatesScanned(validationType) {
  const val_id = validationIds[validationType] || 1;
  const { error, data } = await supabase
    .from("voters_scans")
    .select(
      `id,scanned_type, electorates (firstname,middlename,lastname,brgy,purok,precinctno)`
    )
    .order("created_at", { ascending: false })
    .limit(5);
  if (error) {
    console.error(error);
    throw new Error("Latest Scanned could not be loaded");
  }
  return { data };
}

export async function getKamadaResult(validationType) {
  const val_id = validationIds[validationType] || 1;
  const { data, error } = await supabase.rpc(
    "calculate_projected_data_kamada_v5"
  );

  // const { data, error } = await supabase.rpc(
  //   "calculate_projected_data_kamada_v4"
  // );

  console.log("calculate projected", JSON.stringify(data));
  if (error) {
    console.error(error);
  }

  return { data };
}

export async function getCountAto_groundLeaders(validationType) {
  const val_id = validationIds[validationType] || 1;
  const { data, error, count } = await supabase
    .from("electorates")
    .select("id", { count: "exact" })
    .or(
      "isbaco.eq.true,is_gm.eq.true,is_agm.eq.true,is_legend.eq.true,is_elite.eq.true"
    );
  //  .or(
  //   "isbaco.eq.true,is_gm.eq.true,is_agm.eq.true,is_legend.eq.true,is_elite.eq.true,precinctleader.not.is.null"
  // );
  //  .not("precinctleader", "is", null)
  if (error) {
    console.error(error);
    throw new Error("Counting Gound Leaders Ato could not be loaded");
  }
  console.log("asda", data);
  return { count };
}

export async function getCountPerBrgy_Summary(validationType) {
  const val_id = validationIds[validationType] || 1;
  const { data, error } = await supabase.rpc("get_summary_counts_per_barangay");
  // const { data, error } = await supabase
  //   .from("electorates")
  //   .select(`id,brgy`, {
  //     count: "exact",
  //   })
  //   .is("precinctleader", null)
  //   .is("voters_type", null);

  if (error) {
    console.error(error);
    throw new Error("getCountPerBrgy Ato could not be loaded");
  }
  return { data };
}
