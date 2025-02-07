import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllData,
  // getElectorates,
  getSectors,
} from "../../../services/apiElectorates";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE, barangayOptions } from "../../../utils/constants";
import { useEffect } from "react";
import { useState } from "react";
import {
  getAllElectorates_for_SurveyForm,
  getAllElectorates_Per_Brgy,
  getElectorates_forLeader,
} from "../../../services/apiLeader";

export function useElectoratesPer_Brgy2(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  // PAGINATION
  const page = !searchParams.get("modal_tbl_page")
    ? 1
    : Number(searchParams.get("modal_tbl_page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [electorates, setElectorates] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["electorates2", brgy, page, searchTerm];

  const {
    data,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getElectorates_forLeader({
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
        queryKey: ["electorates2", brgy, page - 1],
        queryFn: () =>
          getElectorates_forLeader({ brgy, page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["electorates2", brgy, page - 1],
        queryFn: () =>
          getElectorates_forLeader({ brgy, page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [queryClient, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}

export function useAllElectoratesPer_Brgy() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const precint = searchParams.get("precinctBy") || "";
  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [electorates, setElectorates] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["all_electorates_per_brgy", brgy, precint, page];

  const {
    data,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getAllElectorates_for_SurveyForm({
        brgy,
        precint,
        page,
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
        queryKey: [
          "all_electorates_per_brgy_surveyform",
          brgy,
          precint,
          page - 1,
        ],
        queryFn: () =>
          getAllElectorates_for_SurveyForm({
            brgy,
            precint,
            page: page - 1,
          }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: [
          "all_electorates_per_brgy_surveyform",
          brgy,
          precint,
          page - 1,
        ],
        queryFn: () =>
          getAllElectorates_for_SurveyForm({
            brgy,
            page: page - 1,
          }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [queryClient, brgy, precint, page, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}

// export function useFetchAllData() {
//   const [searchParams] = useSearchParams();
//   const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
//   const {
//     isPending,
//     data: electorates_all,
//     error,
//   } = useQuery({
//     queryKey: ["electorates_all", brgy],
//     queryFn: () => fetchAllData(brgy),
//   });

//   return { isPending, error, electorates_all };
// }

export function useFetchAllData(shouldFetch) {
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;

  const queryResult = useQuery({
    queryKey: ["electorates_all", brgy],
    queryFn: () => fetchAllData(brgy),
    enabled: shouldFetch, // Conditionally enable the query
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  return {
    electorates_all: queryResult.data,
    isPending: queryResult.isPending,
    error: queryResult.error,
  }; // Return the entire query result object
}
export function useSector() {
  const {
    isPending,
    data: sector,
    error,
  } = useQuery({
    queryKey: ["sector"],
    queryFn: getSectors,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return { isPending, error, sector };
}
