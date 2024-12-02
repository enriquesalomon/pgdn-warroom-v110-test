import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers_baco, getUsersIDStaff } from "../../../../services/apiUsers";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE, barangayOptions } from "../../../../utils/constants";
import { useState } from "react";
import { useEffect } from "react";
import { getBacoAll } from "../../../../services/apiBaco";

export function useUser(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();

  // PAGINATION
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["users_idstaff", page, searchTerm];

  const {
    data,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getUsersIDStaff({
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
        queryKey: ["users_idstaff", page - 1],
        queryFn: () => getUsersIDStaff({ page: page - 1, searchTerm }),
        staleTime: 15 * 60 * 1000, // 15mins
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["users_idstaff", page - 1],
        queryFn: () => getUsersIDStaff({ page: page - 1, searchTerm }),
        staleTime: 15 * 60 * 1000, // 15mins
      });
    }
  }, [queryClient, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, users, count };
}

export function useIDStaffAll() {
  const {
    isPending,
    data: idstaff,
    error,
  } = useQuery({
    queryKey: ["users_idstaff"],
    queryFn: getUsersIDStaff,
    staleTime: 15 * 60 * 1000, // 15mins
  });

  return { isPending, error, idstaff };
}
