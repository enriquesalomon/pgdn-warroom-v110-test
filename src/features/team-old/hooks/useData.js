import { useQuery } from "@tanstack/react-query";
import supabase from "../../../services/supabase";
import { useSearchParams } from "react-router-dom";
const fetchFirstSelectData = async (brgy) => {
  let { data, error } = await supabase.rpc("get_precinct_numbers_brgy", {
    barangay: brgy,
  });

  if (error) throw new Error(error.message);
  return data;
};

const fetchSecondSelectData = async (precinct_no) => {
  let { data, error } = await supabase
    .from("electorates")
    .select(
      "id,precinctno,firstname,middlename,lastname,brgy,precinctleader,isleader"
    )
    .eq("precinctno", precinct_no)
    .is("voters_type", null)
    .order("lastname", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

export const useFirstSelectData = () => {
  const [searchParams] = useSearchParams(); // FILTER
  const brgy = searchParams.get("sortBy");
  return useQuery({
    queryKey: ["firstSelectData", brgy],
    queryFn: () => fetchFirstSelectData(brgy), // Pass the brgy parameter to the query function
    enabled: !!brgy, // Only fetch data if brgy is not null
  });
};

export const useSecondSelectData = (parameter) => {
  return useQuery({
    queryKey: ["secondSelectData", parameter],
    queryFn: () => fetchSecondSelectData(parameter),
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
