import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllData_getAffiliates,
  getAffiliates,
} from "../../../../services/apiElectorates";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE, barangayOptions } from "../../../../utils/constants";
import { useEffect } from "react";
import { useState } from "react";

export function useElectorateFilter(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const filterby = searchParams.get("filterby") || "ALL";
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [electorates, setElectorates] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["electorates_affiliates", filterby, brgy, page, searchTerm];

  const { data, isPending: isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getAffiliates({
        filterby,
        brgy,
        page,
        searchTerm,
      });
      return { data, count };
    },
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
        queryKey: ["electorates_affiliates", brgy, page - 1],
        queryFn: () =>
          getAffiliates({
            filterby,
            brgy,
            page: page - 1,
            searchTerm,
          }),
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["electorates_affiliates", brgy, page - 1],
        queryFn: () =>
          getAffiliates({
            filterby,
            brgy,
            page: page - 1,
            searchTerm,
          }),
      });
    }
  }, [filterby, queryClient, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}

export function useFetchAllData() {
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;

  const queryResult = useQuery({
    queryKey: ["electorates_affiliates_report_all", brgy],
    queryFn: () => fetchAllData_getAffiliates(brgy),
    enabled: true, // Conditionally enable the query
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  return {
    electorates_all: queryResult.data,
    isPending: queryResult.isPending,
    error: queryResult.error,
  }; // Return the entire query result object
}
