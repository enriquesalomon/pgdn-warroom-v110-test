import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getList_UnscannedAto,
  getList_ScannedAto,
} from "../../../services/apiElectorates";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE, barangayOptions } from "../../../utils/constants";
import { useEffect } from "react";
import { useState } from "react";

export function useUnscannedAto(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [electorates, setElectorates] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["voters_unscanned", brgy, page, searchTerm];

  const { data, isPending: isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getList_UnscannedAto({
        brgy,
        page,
        searchTerm,
      });
      return { data, count };
    },
    staleTime: 5 * 60 * 1000, // 5 minute for dashboard stats
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
        queryKey: ["voters_unscanned", brgy, page - 1],
        queryFn: () =>
          getList_UnscannedAto({
            brgy,
            page: page - 1,
            searchTerm,
          }),
        staleTime: 5 * 60 * 1000, // 5 minute for dashboard stats
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["voters_unscanned", brgy, page - 1],
        queryFn: () =>
          getList_UnscannedAto({
            brgy,
            page: page - 1,
            searchTerm,
          }),
        staleTime: 5 * 60 * 1000, // 5 minute for dashboard stats
      });
    }
  }, [queryClient, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}

//OLD
// export function useUnscannedAto(searchTerm) {
//   const queryClient = useQueryClient();
//   const [searchParams] = useSearchParams();
//   const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
//   // PAGINATION
//   const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

//   const [isPending, setIsPending] = useState(true);
//   const [error, setError] = useState(null);
//   const [electorates, setElectorates] = useState([]);
//   const [count, setCount] = useState(0);
//   const validationType = "3v";

//   const queryKey = ["voters_unscanned", "3v", brgy, page, searchTerm];

//   const { data, isPending: isLoading } = useQuery({
//     queryKey,
//     queryFn: async () => {
//       const { data, count } = await getList_UnscannedAto({
//         validationType,
//         brgy,
//         page,
//         searchTerm,
//       });
//       return { data, count };
//     },
//     staleTime: 5 * 60 * 1000, // 5 minute for dashboard stats
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
//         queryKey: ["voters_unscanned", "3v", brgy, page - 1],
//         queryFn: () =>
//           getList_UnscannedAto({
//             validationType,
//             brgy,
//             page: page - 1,
//             searchTerm,
//           }),
//         staleTime: 5 * 60 * 1000, // 5 minute for dashboard stats
//       });
//     }

//     // Prefetch previous page
//     if (page > 1) {
//       queryClient.prefetchQuery({
//         queryKey: ["voters_unscanned", "3v", brgy, page - 1],
//         queryFn: () =>
//           getList_UnscannedAto({
//             validationType,
//             brgy,
//             page: page - 1,
//             searchTerm,
//           }),
//         staleTime: 5 * 60 * 1000, // 5 minute for dashboard stats
//       });
//     }
//   }, [queryClient, brgy, page, searchTerm, pageCount]);

//   return { isPending: isLoading, error, electorates, count };
// }

export function useScannedAto(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [electorates, setElectorates] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["voters_scanned", brgy, page, searchTerm];

  const {
    data,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getList_ScannedAto({
        brgy,
        page,
        searchTerm,
      });
      return { data, count };
    },
    staleTime: 5 * 60 * 1000, // 5 minute for dashboard stats
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
        queryKey: ["voters_scanned", brgy, page - 1],
        queryFn: () =>
          getList_ScannedAto({
            brgy,
            page: page - 1,
            searchTerm,
          }),
        staleTime: 5 * 60 * 1000, // 5 minute for dashboard stats
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["voters_scanned", brgy, page - 1],
        queryFn: () =>
          getList_ScannedAto({
            brgy,
            page: page - 1,
            searchTerm,
          }),
        staleTime: 5 * 60 * 1000, // 5 minute for dashboard stats
      });
    }
  }, [queryClient, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}
