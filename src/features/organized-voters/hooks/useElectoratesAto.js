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
import { getColorCodeBase } from "../../../services/apiColorCodeBase";

export function useElectoratesAto(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const printed_status = searchParams.get("printed_status") || "all";
  const id_requirments = searchParams.get("id_requirments") || "all";
  const voter_type = searchParams.get("voter_type") || "all";
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
    voter_type,
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
        voter_type,
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
        queryKey: ["electorates_ato", brgy, page - 1, searchTerm, voter_type],
        queryFn: () =>
          getElectoratesIDCard({
            brgy,
            printed_status,
            id_requirments,
            page: page - 1,
            searchTerm,
            voter_type,
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
          voter_type,
        ],
        queryFn: () =>
          getElectoratesIDCard({
            brgy,
            printed_status,
            id_requirments,
            page: page - 1,
            searchTerm,
            voter_type,
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
    voter_type,
  ]);

  return { isPending: isLoading, error, electorates, count };
}

export function useColorCodeBase() {
  const { isPending, error, data } = useQuery({
    queryKey: ["color_code"],
    queryFn: getColorCodeBase,
    staleTime: 60 * 60 * 1000, // 1hr
  });

  return { isPending, error, data };
}
