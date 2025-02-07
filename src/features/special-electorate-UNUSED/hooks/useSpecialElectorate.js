import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  // getElectorates,
  getSpecialElectorate,
} from "../../../services/apiSpecialElectorate";
import { useSearchParams } from "react-router-dom";
import { barangayOptions, PAGE_SIZE } from "../../../utils/constants";
import { useEffect } from "react";
import { useState } from "react";
import { getElectorates_Survey_tag_classification } from "../../../services/apiElectorates";

export function useSpecialElectorate(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const assigned = searchParams.get("assigned") || "0";
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [electorates, setElectorates] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["survey_classification", assigned, page, brgy, searchTerm];

  const {
    data,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getSpecialElectorate({
        assigned,
        page,
        brgy,
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
        queryKey: ["survey_classification", page - 1],
        queryFn: () => getSpecialElectorate({ page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["survey_classification", page - 1],
        queryFn: () => getSpecialElectorate({ page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [queryClient, assigned, page, brgy, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}

export function useUnvalidatedElectorates(searchTerm) {
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

  const queryKey = ["survey_tag", brgy, page, searchTerm];

  const { data, isError, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!searchTerm) {
        return { data: [], count: 0 }; // Return empty data if searchTerm is empty
      }
      const { data, count } = await getElectorates_Survey_tag_classification({
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
        queryKey: ["survey_tag", brgy, page - 1],
        queryFn: () =>
          getElectorates_Survey_tag_classification({
            brgy,
            page: page - 1,
            searchTerm,
          }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["survey_tag", brgy, page - 1],
        queryFn: () =>
          getElectorates_Survey_tag_classification({
            brgy,
            page: page - 1,
            searchTerm,
          }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [queryClient, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}

//working old DISPLAY ALL
// export function useUnvalidatedElectorates(searchTerm) {
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

//   const queryKey = ["unvalidated_electorate", brgy, page, searchTerm];

//   const {
//     data,
//     isError,
//     isPending: isLoading,
//   } = useQuery({
//     queryKey,
//     queryFn: async () => {
//       const { data, count } = await getUnvalidated_Electorates({
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
//         queryKey: ["unvalidated_electorate", brgy, page - 1],
//         queryFn: () =>
//           getUnvalidated_Electorates({ brgy, page: page - 1, searchTerm }),
//         staleTime: 5 * 60 * 1000, // 5 minutes
//       });
//     }

//     // Prefetch previous page
//     if (page > 1) {
//       queryClient.prefetchQuery({
//         queryKey: ["unvalidated_electorate", brgy, page - 1],
//         queryFn: () =>
//           getUnvalidated_Electorates({ brgy, page: page - 1, searchTerm }),
//         staleTime: 5 * 60 * 1000, // 5 minutes
//       });
//     }
//   }, [queryClient, brgy, page, searchTerm, pageCount]);

//   return { isPending: isLoading, error, electorates, count };
// }
