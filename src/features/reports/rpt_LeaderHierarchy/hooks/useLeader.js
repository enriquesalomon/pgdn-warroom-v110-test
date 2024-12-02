import { useQuery, useQueryClient } from "@tanstack/react-query";
import { barangayOptions, PAGE_SIZE } from "../../../../utils/constants";
import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { getTopLeaders_teamCount } from "../../../../services/apiLeader";
import {
  getTeams,
  getTeams_per_TopLeaders,
} from "../../../../services/apiTeams";
import supabase from "../../../../services/supabase";
export function useLeader(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [electorates, setElectorates] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["leaders", type, brgy, page, searchTerm];

  const {
    data,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getTopLeaders_teamCount({
        type,
        brgy,
        page,
        searchTerm,
      });
      return { data, count };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
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
        queryKey: ["leaders", brgy, page - 1],
        queryFn: () =>
          getTopLeaders_teamCount({ type, brgy, page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["leaders", brgy, page - 1],
        queryFn: () =>
          getTopLeaders_teamCount({ type, brgy, page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [queryClient, type, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}

const getTeamById = async (teamId) => {
  let query = supabase
    .from("team")
    .select("*")
    .eq("id", teamId)
    .order("id", { ascending: true });

  const { data, error, count } = await query;
  return data;
};
export function useTeams({ topleader_id, leader_type }) {
  // QUERY
  const {
    isPending,
    data: { data: teams, count } = {},
    error,
  } = useQuery({
    queryKey: ["top_leaders_team"],
    // queryFn: ({ queryKey }) => getTeams_per_TopLeaders(),
    queryFn: () => getTeams_per_TopLeaders({ topleader_id, leader_type }),
  });

  // Function to fetch data for a specific team by ID
  const fetchTeamData = async (teamId) => {
    const data = await getTeamById(teamId);
    return data;
  };

  return { isPending, error, teams, count, fetchTeamData };
}
