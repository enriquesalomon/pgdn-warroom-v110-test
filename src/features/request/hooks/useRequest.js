import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { barangayOptions, PAGE_SIZE } from "../../../utils/constants";
import {
  getCheck,
  getCheckRequest,
  getCheckTeam,
  getElectorate,
  getElectorateNames,
  getOriginamMembers,
  getRequest,
  getTeamData,
  getValidationSettings,
} from "../../../services/apiRequest";
import { useState } from "react";
import { useEffect } from "react";

// export function useRequests(request_status) {
//   // QUERY
//   const {
//     isPending,
//     data: { data: requests, count } = {},
//     error,
//   } = useQuery({
//     queryKey: ["requests", request_status],
//     queryFn: ({ queryKey }) => getRequest(request_status),
//     // staleTime: 5 * 60 * 1000, // 5 minutes
//   });

//   return { isPending, error, requests, count };
// }
export function useRequests(searchTerm, request_status) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [requests, setRequests] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["requests", request_status, searchTerm, brgy];

  const { data, isError, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getRequest({
        request_status,
        searchTerm,
        brgy,
      });
      return { data, count };
    },
    // staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: ({ data, count }) => {
      setRequests(data || []);
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
      setRequests(data.data);
      setCount(data.count);
    }
  }, [data]);

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  useEffect(() => {
    if (page < pageCount) {
      queryClient.prefetchQuery({
        queryKey: ["requests", request_status, page + 1, searchTerm, brgy],
        queryFn: () =>
          getRequest({ request_status, page: page + 1, searchTerm, brgy }),
        // staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }

    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["requests", request_status, page - 1, searchTerm, brgy],
        queryFn: () =>
          getRequest({ request_status, page: page - 1, searchTerm, brgy }),
        // staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [queryClient, request_status, page, searchTerm, pageCount, brgy]);

  return { isPending: isLoading, error: isError, requests, count };
}

export function useCheckReq() {
  const [requests, setRequests] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["requests_check"];

  const { data, isError, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getCheckRequest();
      return { data, count };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: ({ data, count }) => {
      setRequests(data || []);
      setCount(count || 0);
    },
    onError: (error) => {},
    keepPreviousData: true, // Optional: Keeps previous data while fetching new data
  });

  // Update state when data changes
  useEffect(() => {
    if (data) {
      setRequests(data.data);
      setCount(data.count);
    }
  }, [data]);

  return { isPending: isLoading, error: isError, requests, count };
}

export const useElectorate = (leader_id) => {
  return useQuery({
    queryKey: ["request_leader", leader_id],
    queryFn: () => getElectorate(leader_id),
    enabled: !!leader_id, // This ensures the second query only runs if parameter is provided
  });
};

export function useCountReq() {
  // QUERY
  const { isPending, data, error } = useQuery({
    queryKey: ["req_count"],
    queryFn: ({ queryKey }) => getCheck(),
    staleTime: 5 * 60 * 1000,
  });

  return { isPending, error, data };
}

export function useFetchMembersName(members_id, electorate_id) {
  let combinedIds = electorate_id ? [...members_id, electorate_id] : members_id;
  // QUERY
  const { isPending, data, error } = useQuery({
    queryKey: ["members_name"],
    queryFn: ({ queryKey }) => getElectorateNames(combinedIds),
    enabled: !!members_id,
    // staleTime: 30 * 60 * 1000, // 30 minutes
  });

  return { isPending, error, data };
}

export function useCheckExistTeam(team_id) {
  // QUERY
  const { isPending, data, error } = useQuery({
    queryKey: ["team_found"],
    queryFn: ({ queryKey }) => getCheckTeam(team_id),
    enabled: !!team_id,
    // staleTime: 30 * 60 * 1000, // 30 minutes
  });

  return { isPending, error, data };
}

export function useFetchOriginalMembers(team_id) {
  // QUERY
  const { isPending, data, error } = useQuery({
    queryKey: ["original_members"],
    queryFn: ({ queryKey }) => getOriginamMembers(team_id),
    enabled: !!team_id,
    // staleTime: 30 * 60 * 1000, // 30 minutes
  });

  return { isPending, error, data };
}
export function useFetchTeamData(leader_id) {
  // QUERY
  const { isPending, data, error } = useQuery({
    queryKey: ["team_data"],
    queryFn: ({ queryKey }) => getTeamData(leader_id),
    // staleTime: 30 * 60 * 1000, // 30 minutes
  });

  return { isPending, error, data };
}

export function useFetchSettings() {
  // QUERY
  const { isPending, data, error } = useQuery({
    queryKey: ["validation_setter"],
    queryFn: ({ queryKey }) => getValidationSettings(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });

  return { isPending, error, data };
}
