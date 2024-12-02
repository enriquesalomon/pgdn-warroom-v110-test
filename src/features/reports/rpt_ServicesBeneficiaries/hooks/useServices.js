import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE, barangayOptions } from "../../../../utils/constants";
import { useEffect } from "react";
import { useState } from "react";
import {
  fetchAllData,
  getReportServices,
} from "../../../../services/apiServices";

export function useBeneficiary(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const type = searchParams.get("voters_type");
  const assType = searchParams.get("assType");
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [electorates, setElectorates] = useState([]);
  const [all_availed, setAll_availed] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = [
    "rpt_services_beneficiary",
    assType,
    type,
    brgy,
    page,
    searchTerm,
  ];

  const { data, isPending: isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, data2, count } = await getReportServices({
        assType,
        type,
        brgy,
        page,
        searchTerm,
      });
      return { data, data2, count };
    },
    staleTime: 5 * 60 * 1000, // 5 minute
    onSuccess: ({ data, data2, count }) => {
      setElectorates(data || []);
      setAll_availed(data2 || []);
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
      setAll_availed(data.data2);
      setCount(data.count);
    }
  }, [data]);

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  useEffect(() => {
    // Prefetch next page
    if (page < pageCount) {
      queryClient.prefetchQuery({
        queryKey: ["rpt_services_beneficiary", assType, type, brgy, page - 1],
        queryFn: () =>
          getReportServices({
            assType,
            type,
            brgy,
            page: page - 1,
            searchTerm,
          }),
        staleTime: 5 * 60 * 1000, // 5 minute
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["rpt_services_beneficiary", assType, type, brgy, page - 1],
        queryFn: () =>
          getReportServices({
            assType,
            type,
            brgy,
            page: page - 1,
            searchTerm,
          }),
        staleTime: 5 * 60 * 1000, // 5 minute
      });
    }
  }, [queryClient, assType, type, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, all_availed, count };
}

export function useFetchAllData(shouldFetch) {
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;

  const queryResult = useQuery({
    queryKey: ["services_all", brgy],
    queryFn: () => fetchAllData(brgy),
    enabled: shouldFetch, // Conditionally enable the query
    staleTime: 5 * 60 * 1000, // 5 minute
  });
  return {
    all_data: queryResult.data,
    isPending: queryResult.isPending,
    error: queryResult.error,
  }; // Return the entire query result object
}
