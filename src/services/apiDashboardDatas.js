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
  nvs,
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
export async function getCountLubas() {
  const { error, count } = await supabase
    .from("electorates")
    .select("id", { count: "exact" })
    .neq("islubas_type", "N/A");
  if (error) {
    console.error(error);
    throw new Error("Electorates could not be loaded");
  }
  return { count };
}
export async function getCountValidated(validationType) {
  console.log("xx checking the survey tag", validationType);
  const condition = validationMapping[validationType] || "Survey";

  if (validationType === "Survey") {
    if (condition === "Survey") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .neq("survey_tag", null);

      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }

      return { count };
    } else {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq(condition, true);

      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
  } else {
    if (validationType === "1v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .neq("firstvalidation_tag", null)
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
    if (validationType === "2v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .neq("secondvalidation_tag", null)
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
    if (validationType === "3v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .neq("thirdvalidation_tag", null)
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
  }
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
  if (validationType === "Survey" || validationType === null) {
    const { error, count } = await supabase
      .from("electorates")
      .select("id", { count: "exact" })
      .eq("survey_tag", "ATO");
    if (error) {
      console.error(error);
      throw new Error("Counting Ato could not be loaded");
    }
    return { count };
  } else {
    const val_id = validationIds[validationType] || 1;
    const { error, count } = await supabase
      .from("electorate_validations")
      .select("id", { count: "exact" })
      .eq("result", ato)
      .eq("validation_id", val_id);
    if (error) {
      console.error(error);
      throw new Error("Counting Ato could not be loaded");
    }
    return { count };
  }
}

export async function getCountDili(validationType) {
  if (validationType === "Survey" || validationType === null) {
    const { error, count } = await supabase
      .from("electorates")
      .select("id", { count: "exact" })
      .eq("survey_tag", "DILI");
    if (error) {
      console.error(error);
      throw new Error("Counting Ato could not be loaded");
    }
    return { count };
  } else {
    // const val_id = validationIds[validationType] || 1;
    // const { error, count } = await supabase
    //   .from("electorate_validations")
    //   .select("id", { count: "exact" })
    //   .eq("result", dili)
    //   .eq("validation_id", val_id);
    // if (error) {
    //   console.error(error);
    //   throw new Error("Counting Ato could not be loaded");
    // }
    // return { count };

    if (validationType === "1v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("firstvalidation_tag", "DILI")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
    if (validationType === "2v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("secondvalidation_tag", "DILI")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
    if (validationType === "3v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("thirdvalidation_tag", "DILI")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
  }
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

export async function getCountUndecided(validationType) {
  if (validationType === "Survey" || validationType === null) {
    const { error, count } = await supabase
      .from("electorates")
      .select("id", { count: "exact" })
      .eq("survey_tag", "UNDECIDED");
    if (error) {
      console.error(error);
      throw new Error("Counting Ato could not be loaded");
    }
    return { count };
  } else {
    if (validationType === "1v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("firstvalidation_tag", "UNDECIDED")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
    if (validationType === "2v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("secondvalidation_tag", "UNDECIDED")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
    if (validationType === "3v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("thirdvalidation_tag", "UNDECIDED")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
  }
}

export async function getCountDeceased(validationType) {
  if (validationType === "Survey" || validationType === null) {
    const { error, count } = await supabase
      .from("electorates")
      .select("id", { count: "exact" })
      .eq("survey_tag", "DECEASED");
    if (error) {
      console.error(error);
      throw new Error("Counting Ato could not be loaded");
    }
    return { count };
  } else {
    if (validationType === "1v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("firstvalidation_tag", "DECEASED")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
    if (validationType === "2v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("secondvalidation_tag", "DECEASED")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
    if (validationType === "3v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("thirdvalidation_tag", "DECEASED")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
  }
}
export async function getCountNVS(validationType) {
  if (validationType === "Survey" || validationType === null) {
    const { error, count } = await supabase
      .from("electorates")
      .select("id", { count: "exact" })
      .eq("survey_tag", "NVS");
    if (error) {
      console.error(error);
      throw new Error("Counting Ato could not be loaded");
    }
    return { count };
  } else {
    if (validationType === "1v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("firstvalidation_tag", "NVS")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
    if (validationType === "2v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("secondvalidation_tag", "NVS")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
    if (validationType === "3v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("thirdvalidation_tag", "NVS")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
  }
}

export async function getCountOT(validationType) {
  if (validationType === "Survey" || validationType === null) {
    const { error, count } = await supabase
      .from("electorates")
      .select("id", { count: "exact" })
      .eq("survey_tag", "OUT OF TOWN");
    if (error) {
      console.error(error);
      throw new Error("Counting Ato could not be loaded");
    }
    return { count };
  } else {
    const val_id = validationIds[validationType] || 1;
    const { error, count } = await supabase
      .from("electorate_validations")
      .select("id", { count: "exact" })
      .eq("result", outoftown)
      .eq("validation_id", val_id);
    if (error) {
      console.error(error);
      throw new Error("Counting OT could not be loaded");
    }
    return { count };
  }
}
export async function getCountINC(validationType) {
  if (validationType === "Survey" || validationType === null) {
    const { error, count } = await supabase
      .from("electorates")
      .select("id", { count: "exact" })
      .eq("survey_tag", "INC");
    if (error) {
      console.error(error);
      throw new Error("Counting Ato could not be loaded");
    }
    return { count };
  } else {
    if (validationType === "1v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("firstvalidation_tag", "INC")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
    if (validationType === "2v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("secondvalidation_tag", "INC")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
    if (validationType === "3v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("thirdvalidation_tag", "INC")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
  }
}
export async function getCountJEHOVAH(validationType) {
  if (validationType === "Survey" || validationType === null) {
    const { error, count } = await supabase
      .from("electorates")
      .select("id", { count: "exact" })
      .eq("survey_tag", "JEHOVAH");
    if (error) {
      console.error(error);
      throw new Error("Counting Ato could not be loaded");
    }
    return { count };
  } else {
    if (validationType === "1v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("firstvalidation_tag", "JEHOVAH")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
    if (validationType === "2v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("secondvalidation_tag", "JEHOVAH")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
    if (validationType === "3v") {
      const { error, count } = await supabase
        .from("electorates")
        .select("id", { count: "exact" })
        .eq("thirdvalidation_tag", "JEHOVAH")
        .is("precinctleader", null);
      if (error) {
        console.error(error);
        throw new Error("Electorates could not be loaded");
      }
      return { count };
    }
  }
}
export async function getCountPerBrgy_BarChart(validationType) {
  const val_id = validationIds[validationType] || 1;
  const { data, error } = await supabase
    .from("electorate_validations")
    .select("result, brgy")
    .eq("validation_id", val_id);

  if (error) {
    console.error(error);
    throw new Error("getCountPerBrgy Ato could not be loaded");
  }
  return { data };
}

// export async function getCountPerBrgy() {
//   const { data, error } = await supabase.rpc(
//     "get_voters_scanned_count_by_brgy"
//   );

//   if (error) {
//     console.error(error);
//     throw new Error("getCountPerBrgy Ato could not be loaded");
//   }
//   return { data };
// }
export async function getCountPerBrgy(validationType) {
  const val_id = validationIds[validationType] || 1;
  const { data, error } = await supabase
    .from("electorate_validations")
    .select("result, brgy")
    .eq("validation_id", val_id);

  if (error) {
    console.error(error);
    throw new Error("getCountPerBrgy Ato could not be loaded");
  }
  return { data };
}

export async function getCountVotersScannedPerBrgy() {
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
  const { data, error } = await supabase.rpc(
    "get_counts_unvalidated_per_brgy",
    {
      validation_id_param: val_id,
    }
  );

  if (error) {
    console.error(error);
    throw new Error("getCountPerBrgy Ato could not be loaded");
  }
  return { data };
}

// export async function getCountPerBrgy_Unvalidated(validationType) {
//   const val_id = validationIds[validationType] || 1;
//   const { data, error } = await supabase.rpc("count_electorates_unvalidated");

//   if (error) {
//     console.error(error);
//     throw new Error("getCountPerBrgy Ato could not be loaded");
//   }
//   return { data };
// }

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
  console.log("xxxxx---", count);
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
    "calculate_projected_data_kamada_v5",
    { validation_id_params: val_id }
  );
  if (error) {
    console.error(error);
  }

  return { data };
}
export async function getSurveyResult() {
  const { data, error } = await supabase.rpc("get_survey_count");
  if (error) {
    console.error(error);
  }

  return { data };
}
export async function getcount_LP_LM_LDC_W() {
  const { data, error } = await supabase.rpc("count_affiliates_per_barangay");
  if (error) {
    console.error(error);
  }

  return { data };
}
export async function getNotTeamResult(validationType) {
  const { data, error } = await supabase.rpc("get_not_team_validation_count", {
    validationtype_param: validationType,
  });

  // const { data, error } = await supabase.rpc("get_not_team_validation_count");
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
  if (validationType === "Survey") {
    const val_id = 1;
    const { data, error } = await supabase.rpc(
      "get_electorate_survey_counts_per_brgy"
    );
    // const { data, error } = await supabase.rpc("get_summary_counts_per_barangay");
    console.log("surveys", JSON.stringify(data));
    if (error) {
      console.error(error);
      throw new Error(
        "get_electorate_survey_counts_per_brgy Ato could not be loaded"
      );
    }
    return { data };
  } else {
    const val_id = validationIds[validationType] || 1;
    const { data, error } = await supabase.rpc(
      "get_electorate_validation_counts_per_brgy",
      { validation_id_param: val_id }
    );
    // const { data, error } = await supabase.rpc("get_summary_counts_per_barangay");
    console.log("round validation", JSON.stringify(data));
    if (error) {
      console.error(error);
      throw new Error("getCountPerBrgy Ato could not be loaded");
    }
    return { data };
  }
}
