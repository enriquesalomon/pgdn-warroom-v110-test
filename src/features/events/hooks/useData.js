import { useQuery } from "@tanstack/react-query";
import supabase from "../../../services/supabase";

const fetchSecondSelectData = async () => {
  let { data, error } = await supabase
    .from("event_type")
    .select("id, type_name,description");
  if (error) throw new Error(error.message);
  return data;
};

export const useSecondSelectData = (parameter) => {
  return useQuery({
    queryKey: ["events", parameter],
    queryFn: () => fetchSecondSelectData(),
  });
};
