import { useQuery } from "@tanstack/react-query";
import supabase from "../../../../services/supabase";
const fetchFirstSelectData = async () => {
  let { data, error } = await supabase.rpc("get_unique_precinctnos");
  if (error) throw new Error(error.message);
  return data;
};

const fetchSecondSelectData = async (precinct_no) => {
  let { data, error } = await supabase
    .from("team")
    .select("id, firstname,lastname")
    .eq("precinctno", precinct_no);
  if (error) throw new Error(error.message);
  return data;
};

export const useFirstSelectData = () => {
  return useQuery({
    queryKey: ["all_precinctno"],
    queryFn: () => fetchFirstSelectData(), // Pass the brgy parameter to the query function
  });
};

export const useSecondSelectData = (parameter) => {
  return useQuery({
    queryKey: ["towers", parameter],
    queryFn: () => fetchSecondSelectData(parameter),
    enabled: !!parameter, // This ensures the second query only runs if parameter is provided
  });
};
