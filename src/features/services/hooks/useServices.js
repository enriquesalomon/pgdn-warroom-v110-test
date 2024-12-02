import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getServices,
  getAssistance_type,
  fetchAllData,
} from "../../../services/apiServices";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE, barangayOptions } from "../../../utils/constants";
import { useEffect, useState } from "react";
import { getElectoratesPer_Brgy2 } from "../../../services/apiElectorates";

export function useServices(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [services, setServices] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["service_avail", brgy, page, searchTerm];

  const { data, isError, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getServices({ brgy, page, searchTerm });
      return { data, count };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: ({ data, count }) => {
      setServices(data || []);
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
      setServices(data.data);
      setCount(data.count);
    }
  }, [data]);

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  useEffect(() => {
    if (page < pageCount) {
      queryClient.prefetchQuery({
        queryKey: ["service_avail", brgy, page + 1, searchTerm],
        queryFn: () => getServices({ brgy, page: page + 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }

    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["service_avail", brgy, page - 1, searchTerm],
        queryFn: () => getServices({ brgy, page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [queryClient, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error: isError, services, count };
}

export function useAssistance_type() {
  const {
    isPending,
    data: assistance,
    error,
  } = useQuery({
    queryKey: ["assistance_type"],
    queryFn: getAssistance_type,
    staleTime: 60 * 60 * 1000, // 1 hour
  });

  return { isPending, error, assistance };
}

export function useFetchAllData(shouldFetch) {
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;

  const queryResult = useQuery({
    queryKey: ["services_all", brgy],
    queryFn: () => fetchAllData(brgy),
    enabled: shouldFetch, // Conditionally enable the query
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  return {
    all_data: queryResult.data,
    isPending: queryResult.isPending,
    error: queryResult.error,
  }; // Return the entire query result object
}

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

  const queryKey = ["electorates_beneficiary", brgy, page, searchTerm];

  const { data, isError, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!searchTerm) {
        return { data: [], count: 0 }; // Return empty data when searchTerm is empty
      }
      const { data, count } = await getElectoratesPer_Brgy2({
        brgy,
        page,
        searchTerm,
      });
      return { data, count };
    },
    enabled: !!searchTerm, // Only fetch if searchTerm is not empty
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
        queryKey: ["electorates_beneficiary", brgy, page - 1],
        queryFn: () =>
          getElectoratesPer_Brgy2({ brgy, page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["electorates_beneficiary", brgy, page - 1],
        queryFn: () =>
          getElectoratesPer_Brgy2({ brgy, page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [queryClient, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}

//OLD WORKING DISPLAY ALL IN FIRST LOAD
// export function useElectoratesPer_Brgy2(searchTerm) {
//   const queryClient = useQueryClient();
//   const [searchParams] = useSearchParams();
//   const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
//   // PAGINATION
//   const page = !searchParams.get("modal_tbl_page")
//     ? 1
//     : Number(searchParams.get("modal_tbl_page"));

//   const [isPending, setIsPending] = useState(true);
//   const [error, setError] = useState(null);
//   const [electorates, setElectorates] = useState([]);
//   const [count, setCount] = useState(0);

//   const queryKey = ["electorates_beneficiary", brgy, page, searchTerm];

//   const {
//     data,
//     isError,
//     isPending: isLoading,
//   } = useQuery({
//     queryKey,
//     queryFn: async () => {
//       const { data, count } = await getElectoratesPer_Brgy2({
//         brgy,
//         page,
//         searchTerm,
//       });
//       return { data, count };
//     },
//     staleTime: 5 * 60 * 1000, // 5 minutes
//     onSuccess: ({ data, count }) => {
//       setElectorates(data || []);
//       setCount(count || 0);
//       setIsPending(false);
//       setError(null);
//     },
//     onError: (error) => {
//       setError(error);
//       setIsPending(false);
//     },
//     keepPreviousData: true, // Optional: Keeps previous data while fetching new data
//   });

//   // Update state when data changes
//   useEffect(() => {
//     if (data) {
//       setElectorates(data.data);
//       setCount(data.count);
//     }
//   }, [data]);

//   // PRE-FETCHING
//   const pageCount = Math.ceil(count / PAGE_SIZE);

//   useEffect(() => {
//     // Prefetch next page
//     if (page < pageCount) {
//       queryClient.prefetchQuery({
//         queryKey: ["electorates_beneficiary", brgy, page - 1],
//         queryFn: () =>
//           getElectoratesPer_Brgy2({ brgy, page: page - 1, searchTerm }),
//         staleTime: 5 * 60 * 1000, // 5 minutes
//       });
//     }

//     // Prefetch previous page
//     if (page > 1) {
//       queryClient.prefetchQuery({
//         queryKey: ["electorates_beneficiary", brgy, page - 1],
//         queryFn: () =>
//           getElectoratesPer_Brgy2({ brgy, page: page - 1, searchTerm }),
//         staleTime: 5 * 60 * 1000, // 5 minutes
//       });
//     }
//   }, [queryClient, brgy, page, searchTerm, pageCount]);

//   return { isPending: isLoading, error, electorates, count };
// }