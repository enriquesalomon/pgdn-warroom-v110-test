import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE, barangayOptions } from "../../../utils/constants";
import { useEffect, useState } from "react";
import { getEventAttendees } from "../../../services/apiEventAttendees";

export function useAttendees(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const event = searchParams.get("event") || 0;

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [attendees, setAttendees] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["attendees", event, page, searchTerm];

  const { data, isError, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getEventAttendees({
        event,
        page,
        searchTerm,
      });
      return { data, count };
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    onSuccess: ({ data, count }) => {
      setAttendees(data || []);
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
      setAttendees(data.data);
      setCount(data.count);
    }
  }, [data]);

  // PRE-FETCHING
  const pageCount = Math.ceil(count / PAGE_SIZE);

  useEffect(() => {
    if (page < pageCount) {
      queryClient.prefetchQuery({
        queryKey: ["attendees", event, page + 1, searchTerm],
        queryFn: () => getEventAttendees({ event, page: page + 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }

    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["attendees", event, page - 1, searchTerm],
        queryFn: () => getEventAttendees({ event, page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [queryClient, event, page, searchTerm, pageCount]);

  return { isPending: isLoading, error: isError, attendees, count };
}
