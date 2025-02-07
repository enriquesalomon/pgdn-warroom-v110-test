import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getElectorates_forBaco, getBaco } from "../../../services/apiBaco";
import { useSearchParams } from "react-router-dom";
import { barangayOptions, PAGE_SIZE } from "../../../utils/constants";
import { useEffect } from "react";
import { useState } from "react";

export function useBaco(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [electorates, setElectorates] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["baco", page, searchTerm];

  const {
    data,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getBaco({
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
        queryKey: ["baco", page - 1],
        queryFn: () => getBaco({ page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["baco", page - 1],
        queryFn: () => getBaco({ page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [queryClient, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}

export function useElectorates_forBaco(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [electorates, setElectorates] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["electorates_for_baco", brgy, page, searchTerm];

  const { data, isError, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!searchTerm) {
        return { data: [], count: 0 }; // Return empty data when searchTerm is empty
      }
      const { data, count } = await getElectorates_forBaco({
        brgy,
        page,
        searchTerm,
      });
      return { data, count };
    },
    enabled: !!searchTerm, // Only fetch if searchTerm is not empty
    // staleTime: 5 * 60 * 1000, // 5 minutes
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
        queryKey: ["electorates_for_baco", brgy, page - 1],
        queryFn: () =>
          getElectorates_forBaco({ brgy, page: page - 1, searchTerm }),
        // staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["electorates_for_baco", brgy, page - 1],
        queryFn: () =>
          getElectorates_forBaco({ brgy, page: page - 1, searchTerm }),
        // staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [queryClient, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}

//--old working display all in first load
// export function useElectorates_forBaco(searchTerm) {
//   const queryClient = useQueryClient();
//   const [searchParams] = useSearchParams();
//   const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
//   // PAGINATION
//   const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

//   const [isPending, setIsPending] = useState(true);
//   const [error, setError] = useState(null);
//   const [electorates, setElectorates] = useState([]);
//   const [count, setCount] = useState(0);

//   const queryKey = ["electorates_for_baco", brgy, page, searchTerm];

//   const {
//     data,
//     isError,
//     isPending: isLoading,
//   } = useQuery({
//     queryKey,
//     queryFn: async () => {
//       const { data, count } = await getElectorates_forBaco({
//         brgy,
//         page,
//         searchTerm,
//       });
//       return { data, count };
//     },
//     // staleTime: 5 * 60 * 1000, // 5 minutes
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
//         queryKey: ["electorates_for_baco", brgy, page - 1],
//         queryFn: () =>
//           getElectorates_forBaco({ brgy, page: page - 1, searchTerm }),
//         // staleTime: 5 * 60 * 1000, // 5 minutes
//       });
//     }

//     // Prefetch previous page
//     if (page > 1) {
//       queryClient.prefetchQuery({
//         queryKey: ["electorates_for_baco", brgy, page - 1],
//         queryFn: () =>
//           getElectorates_forBaco({ brgy, page: page - 1, searchTerm }),
//         // staleTime: 5 * 60 * 1000, // 5 minutes
//       });
//     }
//   }, [queryClient, brgy, page, searchTerm, pageCount]);

//   return { isPending: isLoading, error, electorates, count };
// }
