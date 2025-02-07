import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllData_Team_List,
  getTeamList,
  getTeamListByGroup,
} from "../../../../services/apiTeams";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE, barangayOptions } from "../../../../utils/constants";
import { useEffect } from "react";
import { useState } from "react";
import supabase from "../../../../services/supabase";
import { getBrgy_Precincts } from "../../../../services/apiPrecinct";

export function useElectorate(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  // const assigned = searchParams.get("assigned");
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [electorates, setElectorates] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["team_list", brgy, page, searchTerm];

  const {
    data,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getTeamListByGroup({
        brgy,
        page,
        searchTerm,
      });
      return { data, count };
    },
    // staleTime: 10 * 60 * 1000, // 10 minute
    staleTime: 0,
    onSuccess: ({ data, count }) => {
      setElectorates(data || []);
      setCount(count || 0);
      setIsPending(false);
      setError(null);
    },
    onError: (error) => {
      setError(error);
      setIsPending(false);
    },
    keepPreviousData: true, // Optional: Keeps previous data while fetching new data
  });

  // Update state when data changes
  useEffect(() => {
    if (data) {
      setElectorates(data.data);
      setCount(data.count);
    }
  }, [data]);
  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  useEffect(() => {
    // Prefetch next page
    if (page < pageCount) {
      queryClient.prefetchQuery({
        queryKey: ["team_list", brgy, page - 1],
        queryFn: () =>
          getTeamList({
            brgy,
            page: page - 1,
            searchTerm,
          }),
        staleTime: 0,
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["team_list", brgy, page - 1],
        queryFn: () =>
          getTeamList({
            brgy,
            page: page - 1,
            searchTerm,
          }),
        staleTime: 0,
      });
    }
  }, [queryClient, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}

export function useFetchAllData(shouldFetch) {
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;

  const queryResult = useQuery({
    queryKey: ["team_list_all", brgy],
    queryFn: () => fetchAllData_Team_List({ brgy }),
    enabled: shouldFetch, // Conditionally enable the query
    staleTime: 10 * 60 * 1000, // 10 minute
  });
  return {
    electorates_all: queryResult.data,
    isPending: queryResult.isPending,
    error: queryResult.error,
  }; // Return the entire query result object
}

const fetchSecondSelectData = async (precinctleader) => {
  let { data, error } = await supabase
    .from("electorates")
    .select("id,precinctno,firstname,middlename,lastname,purok,brgy")
    .eq("precinctleader", precinctleader)
    .order("lastname", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

export const useGetMembers = (parameter) => {
  return useQuery({
    queryKey: ["team_members_to_print", parameter],
    queryFn: () => fetchSecondSelectData(parameter),
    enabled: !!parameter, // This ensures the second query only runs if parameter is provided
  });
};

const fetchNames = async (id) => {
  let { data, error } = await supabase
    .from("electorates")
    .select("id,precinctno")
    .eq("id", id);

  if (error) throw new Error(error.message);
  return data;
};

export const useTower = (parameter) => {
  return useQuery({
    queryKey: ["tower", parameter],
    queryFn: () => fetchNames(parameter),
    enabled: !!parameter, // This ensures the second query only runs if parameter is provided
  });
};

const fetchFirstSelectData = async (brgy) => {
  // let { data, error } = await supabase.rpc("get_precinct_numbers_brgy", {
  //   barangay: brgy,
  // });

  // if (error) throw new Error(error.message);
  // return data;

  const { data, error } = await supabase
    .from("clustered_precincts")
    .select("*")
    .eq("barangay", brgy);

  if (error) {
    console.error(error);
    throw new Error("clustered_precincts could not be loaded");
  }
  return data;
};
export const useFirstSelectData = () => {
  const [searchParams] = useSearchParams(); // FILTER
  const brgy = searchParams.get("sortBy") || "BOGAYO";
  return useQuery({
    queryKey: ["firstSelectData", brgy],
    queryFn: () => fetchFirstSelectData(brgy), // Pass the brgy parameter to the query function
    enabled: !!brgy, // Only fetch data if brgy is not null
  });
};

export function useBrgyPrecincts() {
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const {
    isPending,
    error,
    data: all_precincts,
  } = useQuery({
    queryKey: ["all_precincts"],
    // queryFn: getSettings(),
    queryFn: () => getBrgy_Precincts(brgy),
  });

  return { isPending, error, all_precincts };
}
