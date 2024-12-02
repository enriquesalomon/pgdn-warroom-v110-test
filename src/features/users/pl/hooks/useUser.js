import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers } from "../../../../services/apiUsers";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE, barangayOptions } from "../../../../utils/constants";
import { useState } from "react";
import { useEffect } from "react";

export function useUser(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["users_PL", brgy, page, searchTerm];

  const {
    data,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getUsers({
        brgy,
        page,
        searchTerm,
      });
      return { data, count };
    },
    staleTime: 15 * 60 * 1000, // 15mins
    onSuccess: ({ data, count }) => {
      setUsers(data || []);
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
      setUsers(data.data);
      setCount(data.count);
    }
  }, [data]);

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  useEffect(() => {
    // Prefetch next page
    if (page < pageCount) {
      queryClient.prefetchQuery({
        queryKey: ["users_PL", brgy, page - 1],
        queryFn: () => getUsers({ brgy, page: page - 1, searchTerm }),
        staleTime: 15 * 60 * 1000, // 15mins
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["users_PL", brgy, page - 1],
        queryFn: () => getUsers({ brgy, page: page - 1, searchTerm }),
        staleTime: 15 * 60 * 1000, // 15mins
      });
    }
  }, [queryClient, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, users, count };
}
