import { useQuery } from "@tanstack/react-query";
import supabase from "../../../../services/supabase";

const fetchSecondSelectData = async () => {
  let { data, error } = await supabase
    .from("baco")
    .select("id, firstname,middlename,lastname,brgy")
    .eq("status", "active");
  if (error) throw new Error(error.message);
  return data;
};

export const useSecondSelectData = (parameter) => {
  return useQuery({
    queryKey: ["baco_names", parameter],
    queryFn: () => fetchSecondSelectData(),
  });
};
