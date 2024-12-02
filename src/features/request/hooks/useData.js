import { useQuery } from "@tanstack/react-query";
import supabase from "../../../services/supabase";

const fetchNames = async (id) => {
  let { data, error } = await supabase
    .from("electorates")
    .select(
      "id,precinctno,firstname,middlename,lastname,precinctleader,isleader,voters_type,isbaco,is_gm,is_agm,is_legend,is_elite"
    )
    .eq("id", id)
    .order("id", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};
const fetchNameBaco = async (id) => {
  let { data, error } = await supabase.from("baco").select("*").eq("id", id);
  if (error) throw new Error(error.message);
  return data;
};

export const useGM = (parameter) => {
  return useQuery({
    queryKey: ["gm", parameter],
    queryFn: () => fetchNames(parameter),
    enabled: !!parameter, // This ensures the second query only runs if parameter is provided
  });
};
export const useAGM = (parameter) => {
  return useQuery({
    queryKey: ["agm", parameter],
    queryFn: () => fetchNames(parameter),
    enabled: !!parameter, // This ensures the second query only runs if parameter is provided
  });
};
export const useLegend = (parameter) => {
  return useQuery({
    queryKey: ["legend", parameter],
    queryFn: () => fetchNames(parameter),
    enabled: !!parameter, // This ensures the second query only runs if parameter is provided
  });
};
export const useElite = (parameter) => {
  return useQuery({
    queryKey: ["elite", parameter],
    queryFn: () => fetchNames(parameter),
    enabled: !!parameter, // This ensures the second query only runs if parameter is provided
  });
};
export const useBacoName = (parameter) => {
  return useQuery({
    queryKey: ["baco", parameter],
    queryFn: () => fetchNameBaco(parameter),
    enabled: !!parameter, // This ensures the second query only runs if parameter is provided
  });
};
export const useTower = (parameter) => {
  return useQuery({
    queryKey: ["tower", parameter],
    queryFn: () => fetchNames(parameter),
    enabled: !!parameter, // This ensures the second query only runs if parameter is provided
  });
};
