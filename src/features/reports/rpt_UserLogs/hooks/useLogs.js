import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchAllData_Logs, getLogs } from "../../../../services/apiUserLogs";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE, barangayOptions } from "../../../../utils/constants";
import { useEffect } from "react";
import { useState } from "react";

export function useLogs(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [logs, setLogs] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["rpt_userlogs", page, searchTerm];

  const { data, isPending: isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getLogs({
        page,
        searchTerm,
      });
      return { data, count };
    },
    staleTime: 5 * 60 * 1000, // 5 minute
    onSuccess: ({ data, count }) => {
      setLogs(data || []);
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
      setLogs(data.data);
      setCount(data.count);
    }
  }, [data]);

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  useEffect(() => {
    // Prefetch next page
    if (page < pageCount) {
      queryClient.prefetchQuery({
        queryKey: ["rpt_userlogs", page - 1],
        queryFn: () =>
          getLogs({
            page: page - 1,
            searchTerm,
          }),
        staleTime: 5 * 60 * 1000, // 5 minute
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["rpt_userlogs", page - 1],
        queryFn: () =>
          getLogs({
            page: page - 1,
            searchTerm,
          }),
        staleTime: 5 * 60 * 1000, // 5 minute
      });
    }
  }, [queryClient, page, pageCount, searchTerm]);

  return { isPending: isLoading, error, logs, count };
}

export function useFetchAllData(shouldFetch) {
  const queryResult = useQuery({
    queryKey: ["all_logs"],
    queryFn: () => fetchAllData_Logs(),
    enabled: shouldFetch, // Conditionally enable the query
    staleTime: 15 * 60 * 1000, // 15 minute
  });
  return {
    all_logs: queryResult.data,
    isPending: queryResult.isPending,
    error: queryResult.error,
  }; // Return the entire query result object
}
