import supabase from "./supabase";
import { PAGE_SIZE } from "../utils/constants";

export async function fetchAllData(brgy) {
  let data = [];
  let from = 0;
  const limit = 1000;

  while (true) {
    const { data: chunk, error } = await supabase
      .from("services")
      .select("*")
      .eq("barangay", brgy)
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
export async function getServices({ brgy, page, searchTerm }) {
  let query = supabase
    .from("services")
    .select("*", { count: "exact" })
    .eq("barangay", brgy)
    .order("created_at", { ascending: false });

  if (searchTerm) {
    query = query.or(
      `fullname.ilike.%${searchTerm}%,assistance_type.ilike.%${searchTerm}%`
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
    throw new Error("services could not be loaded");
  }
  return { data, count };
}

export async function getReportServices({
  assType,
  type,
  brgy,
  page,
  searchTerm,
}) {
  let query = supabase
    .from("services")
    .select(
      `*,electorates (isleader,precinctleader,isbaco,is_gm,is_agm,is_legend,is_elite)`,
      {
        count: "exact",
      }
    )

    .eq("barangay", brgy);

  if (assType !== "") {
    query = query.eq("assistance_type", assType);
  }

  // if (type === "GM") {
  //   query = query.eq("electorates.is_gm", true);
  // } else if (type === "BACO") {
  //   query = query.eq("electorates.isbaco", true);
  // } else if (type === "AGM") {
  //   query = query.eq("electorates.is_agm", true);
  // } else if (type === "LEGEND") {
  //   query = query.eq("electorates.is_legend", true);
  // } else if (type === "ELITE") {
  //   query = query.eq("electorates.is_elite", true);
  // } else if (type === "WARRIORS") {
  //   query = query.eq("electorates.isleader", true);
  // } else if (type === "NOT_IN_TEAM") {
  //   query = query
  //     .filter("electorates.precinctleader", "is", null)
  //     .filter("electorates.isbaco", "is", null)
  //     .not("electorates.is_gm", "is", true)
  //     .not("electorates.is_agm", "is", true)
  //     .not("electorates.is_legend", "is", true)
  //     .not("electorates.is_elite", "is", true);
  // }
  if (searchTerm) {
    query = query.or(`fullname.ilike.%${searchTerm}%`);
  }

  if (!searchTerm && page) {
    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data, error, count } = await query;

  let distinctData = [];
  if (error) {
    console.error("Error fetching data:", error.message);
  } else {
    // Filter distinct values based on electorate_id
    distinctData = data.reduce((acc, current) => {
      const isElectorateIdExists = acc.some(
        (item) => item.electorate_id === current.electorate_id
      );
      if (!isElectorateIdExists) {
        acc.push(current);
      }
      return acc;
    }, []);
  }

  if (error) {
    console.error(error);
    throw new Error("electorates could not be loaded");
  }
  return { data: distinctData, data2: data, count };
}

export async function createEditService(newServicesData, id) {
  let query = supabase.from("services");

  // A) CREATE
  if (!id) query = query.insert([{ ...newServicesData }]);

  // B) EDIT
  // if (id) query = query.update({ ...newLeader, image: imagePath }).eq("id", id);
  if (id) query = query.update({ ...newServicesData }).eq("id", id);

  const { data: servicesData, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("Service Availment could not be created");
  }

  return servicesData;
}

export async function deleteService(id) {
  const { data, error } = await supabase.from("services").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Service Availed could not be deleted");
  }

  return { data, error };
}

export async function getAssistance_type() {
  let query = supabase
    .from("assistance_type")
    .select("name")
    .order("name", { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("sector could not be loaded");
  }
  return data;
}
