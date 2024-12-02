import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../../utils/constants";
import { useEffect } from "react";
import { useState } from "react";
import { getSector } from "../../../services/apiSector";

export function useSector() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [sector, setSector] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["sector", page];

  const {
    data,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getSector({
        page,
      });
      return { data, count };
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    onSuccess: ({ data, count }) => {
      setSector(data || []);
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
      setSector(data.data);
      setCount(data.count);
    }
  }, [data]);

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  useEffect(() => {
    // Prefetch next page
    if (page < pageCount) {
      queryClient.prefetchQuery({
        queryKey: ["sector", page - 1],
        queryFn: () => getSector({ page: page - 1 }),
        staleTime: 30 * 60 * 1000, // 30 minutes
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["sector", page - 1],
        queryFn: () => getSector({ page: page - 1 }),
        staleTime: 30 * 60 * 1000, // 30 minutes
      });
    }
  }, [queryClient, page, pageCount]);

  return { isPending: isLoading, error, sector, count };
}
