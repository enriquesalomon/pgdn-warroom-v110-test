import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import supabase from "../../services/supabase";

export const useElectoratesSearch = (searchname) => {
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy");

  const { isLoading, data, error } = useQuery({
    queryKey: ["electorates_search", searchname, brgy],
    queryFn: () => getElectoratesSearch({ search: searchname, brgy }),
    enabled: !!searchname, // only run the query if searchname is not empty
  });

  return { isLoading, error, data };
};

export async function getElectoratesSearch({ brgy, search }) {
  let query = supabase
    .from("electorates")
    .select("*")
    .ilike("firstname", `%${search}%`)
    .eq("brgy", brgy);

  const { data, error } = await query;

  if (error) {
    console.error(error);
    throw new Error("Electorates could not be loaded");
  }

  return data;
}
