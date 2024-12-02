import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllData_Electorates_Classification,
  getElectorates_Classification,
} from "../../../../services/apiElectorates";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE, barangayOptions } from "../../../../utils/constants";
import { useEffect } from "react";
import { useState } from "react";

export function useElectorate(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const assigned = searchParams.get("assigned");
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [electorates, setElectorates] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = [
    "electorates_classification",
    assigned,
    brgy,
    page,
    searchTerm,
  ];

  const {
    data,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getElectorates_Classification({
        assigned,
        brgy,
        page,
        searchTerm,
      });
      return { data, count };
    },
    staleTime: 10 * 60 * 1000, // 10 minute
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
        queryKey: ["electorates_classification", assigned, brgy, page - 1],
        queryFn: () =>
          getElectorates_Classification({
            assigned,
            brgy,
            page: page - 1,
            searchTerm,
          }),
        staleTime: 10 * 60 * 1000, // 10 minute
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["electorates_classification", assigned, brgy, page - 1],
        queryFn: () =>
          getElectorates_Classification({
            assigned,
            brgy,
            page: page - 1,
            searchTerm,
          }),
        staleTime: 10 * 60 * 1000, // 10 minute
      });
    }
  }, [queryClient, assigned, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}

export function useFetchAllData(shouldFetch) {
  const [searchParams] = useSearchParams();
  const assigned = searchParams.get("assigned");
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;

  const queryResult = useQuery({
    queryKey: ["electorates_classification_all", brgy, assigned],
    queryFn: () => fetchAllData_Electorates_Classification({ brgy, assigned }),
    enabled: shouldFetch, // Conditionally enable the query
    staleTime: 10 * 60 * 1000, // 10 minute
  });
  return {
    electorates_all: queryResult.data,
    isPending: queryResult.isPending,
    error: queryResult.error,
  }; // Return the entire query result object
}
