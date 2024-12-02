import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../../../utils/constants";
import { useEffect } from "react";
import { useState } from "react";
import { getAssType } from "../../../services/apiAssistanceType";

export function useAssType() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [asstype, setAsstype] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["asstype", page];

  const {
    data,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getAssType({
        page,
      });
      return { data, count };
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    onSuccess: ({ data, count }) => {
      setAsstype(data || []);
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
      setAsstype(data.data);
      setCount(data.count);
    }
  }, [data]);

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  useEffect(() => {
    // Prefetch next page
    if (page < pageCount) {
      queryClient.prefetchQuery({
        queryKey: ["asstype", page - 1],
        queryFn: () => getAssType({ page: page - 1 }),
        staleTime: 30 * 60 * 1000, // 30 minutes
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["asstype", page - 1],
        queryFn: () => getAssType({ page: page - 1 }),
        staleTime: 30 * 60 * 1000, // 30 minutes
      });
    }
  }, [queryClient, page, pageCount]);

  return { isPending: isLoading, error, asstype, count };
}
