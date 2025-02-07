import { useQuery } from "@tanstack/react-query";
import supabase from "../../../services/supabase";
import { useSearchParams } from "react-router-dom";
// Your fetchFirstSelectData function
const fetchFirstSelectData = async (brgy) => {
  if (!brgy) {
    return { data: [], data_clustered: [] }; // Return empty arrays if brgy is invalid
  }

  const { data, error } = await supabase.rpc("get_precinct_numbers_brgy", {
    barangay: brgy,
  });
  const { data: data_clustered, error: error1 } = await supabase
    .from("clustered_precincts")
    .select("*")
    .eq("barangay", brgy);

  if (error) throw new Error(error.message);
  if (error1) throw new Error(error1.message);

  return {
    data: data || [], // Ensure data is always defined
    data_clustered: data_clustered || [], // Ensure data_clustered is always defined
  };
};
const fetchSecondSelectData = async (brgy) => {
  let { data, error } = await supabase
    .from("electorates")
    .select(
      "id,precinctno,firstname,middlename,lastname,name_ext,brgy,precinctleader,isleader,purok"
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
    .eq("islubas_type", "N/A")
    .order("lastname", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

export const useFirstSelectData = () => {
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy");

  return useQuery({
    queryKey: ["firstSelectData", brgy],
    queryFn: () => fetchFirstSelectData(brgy),
    enabled: !!brgy, // Only fetch data if brgy is not null or undefined
  });
};

export const useSecondSelectData = (parameter) => {
  return useQuery({
    queryKey: ["secondSelectData", parameter],
    queryFn: () => fetchSecondSelectData(parameter),
    enabled: !!parameter, // This ensures the second query only runs if parameter is provided
  });
};

const fetchClustered_Electorates = async (precinct_nos) => {
  console.log("clustered precinct fetch params", precinct_nos);
  let { data, error } = await supabase
    .from("electorates")
    .select(
      "id,precinctno,firstname,middlename,name_ext,lastname,brgy,precinctleader,isleader"
    )
    // .eq("precinctno", precinct_nos)
    .eq("precinctno", precinct_nos)
    .is("precinctleader", null)
    .is("voters_type", null)
    .is("isbaco", null)
    .is("is_gm", null)
    .is("is_agm", null)
    .is("is_legend", null)
    .is("is_elite", null)
    .is("is_pending_team", null)
    .order("lastname", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

export const useGetClustered_Precinct_Electorates = (parameter) => {
  return useQuery({
    queryKey: ["clusteredElectorates", parameter],
    queryFn: () => fetchClustered_Electorates(parameter),
    enabled: !!parameter, // This ensures the second query only runs if parameter is provided
  });
};

const fetchTeamMembers = async (leaderId) => {
  let { data, error } = await supabase
    .from("team")
    .select("*")
    .eq("id", leaderId);
  if (error) throw new Error(error.message);
  return data;
};

export const useTeamMembers = (leaderId) => {
  return useQuery({
    queryKey: ["team_members", leaderId],
    queryFn: () => fetchTeamMembers(leaderId),
    enabled: !!leaderId, // This ensures the second query only runs if parameter is provided
  });
};

// const fetchNames = async (id) => {
//   let { data, error } = await supabase
//     .from("electorates")
//     .select("id,precinctno,firstname,middlename,lastname")
//     .eq("id", id)
//     .is("voters_type", null)
//     .order("lastname", { ascending: true });
//   if (error) throw new Error(error.message);
//   return data;
// };
// const fetchNameBaco = async (id) => {
//   let { data, error } = await supabase
//     .from("baco")
//     .select("id,firstname,middlename,lastname")
//     .eq("id", id);
//   if (error) throw new Error(error.message);
//   return data;
// };

// export const useGM = (parameter) => {
//   return useQuery({
//     queryKey: ["gm", parameter],
//     queryFn: () => fetchNames(parameter),
//     enabled: !!parameter, // This ensures the second query only runs if parameter is provided
//   });
// };
// export const useAGM = (parameter) => {
//   return useQuery({
//     queryKey: ["agm", parameter],
//     queryFn: () => fetchNames(parameter),
//     enabled: !!parameter, // This ensures the second query only runs if parameter is provided
//   });
// };
// export const useLegend = (parameter) => {
//   return useQuery({
//     queryKey: ["legend", parameter],
//     queryFn: () => fetchNames(parameter),
//     enabled: !!parameter, // This ensures the second query only runs if parameter is provided
//   });
// };
// export const useElite = (parameter) => {
//   return useQuery({
//     queryKey: ["elite", parameter],
//     queryFn: () => fetchNames(parameter),
//     enabled: !!parameter, // This ensures the second query only runs if parameter is provided
//   });
// };
// export const useBacoName = (parameter) => {
//   return useQuery({
//     queryKey: ["baco", parameter],
//     queryFn: () => fetchNameBaco(parameter),
//     enabled: !!parameter, // This ensures the second query only runs if parameter is provided
//   });
// };
