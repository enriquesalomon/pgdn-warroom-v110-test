import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  // getElectorates,
  getElectoratesAto,
  getElectoratesIDCard,
} from "../../../services/apiElectorates";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE, barangayOptions } from "../../../utils/constants";
import { useEffect } from "react";
import { useState } from "react";

export function useElectoratesAto(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const printed_status = searchParams.get("printed_status") || "all";
  const id_requirments = searchParams.get("id_requirments") || "all";

  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [electorates, setElectorates] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = [
    "electorates_ato",
    brgy,
    printed_status,
    id_requirments,
    page,
    searchTerm,
  ];

  const { data, isPending: isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getElectoratesIDCard({
        brgy,
        printed_status,
        id_requirments,
        page,
        searchTerm,
      });
      return { data, count };
    },
    // staleTime: 5 * 60 * 1000, // 5 minute

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
        queryKey: ["electorates_ato", brgy, page - 1, searchTerm],
        queryFn: () =>
          getElectoratesIDCard({
            brgy,
            printed_status,
            id_requirments,
            page: page - 1,
            searchTerm,
          }),
        // staleTime: 5 * 60 * 1000, // 5 minute
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: [
          "electorates_ato",
          brgy,
          printed_status,
          id_requirments,
          page - 1,
          searchTerm,
        ],
        queryFn: () =>
          getElectoratesIDCard({
            brgy,
            printed_status,
            id_requirments,
            page: page - 1,
            searchTerm,
          }),
        // staleTime: 5 * 60 * 1000, // 5 minute
      });
    }
  }, [
    queryClient,
    brgy,
    printed_status,
    id_requirments,
    page,
    searchTerm,
    pageCount,
  ]);

  return { isPending: isLoading, error, electorates, count };
}
//OLD
// export function useElectoratesAto(searchTerm) {
//   const queryClient = useQueryClient();
//   const [searchParams] = useSearchParams();
//   const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
//   // PAGINATION
//   const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

//   const [isPending, setIsPending] = useState(true);
//   const [error, setError] = useState(null);
//   const [electorates, setElectorates] = useState([]);
//   const [count, setCount] = useState(0);
//   const validationType = "2v";

//   const queryKey = ["electorates_ato", "2v", brgy, page, searchTerm];

//   const { data, isPending: isLoading } = useQuery({
//     queryKey,
//     queryFn: async () => {
//       const { data, count } = await getElectoratesAto({
//         validationType,
//         brgy,
//         page,
//         searchTerm,
//       });
//       return { data, count };
//     },
//     staleTime: 5 * 60 * 1000, // 5 minute
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
//         queryKey: ["electorates_ato", "2v", brgy, page - 1],
//         queryFn: () =>
//           getElectoratesAto({
//             validationType,
//             brgy,
//             page: page - 1,
//             searchTerm,
//           }),
//         staleTime: 5 * 60 * 1000, // 5 minute
//       });
//     }

//     // Prefetch previous page
//     if (page > 1) {
//       queryClient.prefetchQuery({
//         queryKey: ["electorates_ato", "2v", brgy, page - 1],
//         queryFn: () =>
//           getElectoratesAto({
//             validationType,
//             brgy,
//             page: page - 1,
//             searchTerm,
//           }),
//         staleTime: 5 * 60 * 1000, // 5 minute
//       });
//     }
//   }, [queryClient, brgy, page, searchTerm, pageCount]);

//   return { isPending: isLoading, error, electorates, count };
// }
