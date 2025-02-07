import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { barangayOptions, PAGE_SIZE } from "../../../utils/constants";
import { useEffect } from "react";
import { useState } from "react";
import {
  getAllVoters_Unscanned,
  getScanned_Voters,
} from "../../../services/apiVoters";
import {
  getElectorates_Ato_Per_Brgy,
  getElectoratesAto,
} from "../../../services/apiElectorates";

export function useScanned_Voters(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const voters_remarks = searchParams.get("voters_remarks") || "0";
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [electorates, setElectorates] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["scanned_voters", voters_remarks, page, brgy, searchTerm];

  const {
    data,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getScanned_Voters({
        voters_remarks,
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
        queryKey: ["scanned_voters", page - 1],
        queryFn: () => getScanned_Voters({ page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["scanned_voters", page - 1],
        queryFn: () => getScanned_Voters({ page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [queryClient, voters_remarks, page, brgy, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}
export function useUnscanned_Voters(searchTerm) {
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

  const queryKey = ["unscanned_voters", brgy, page, searchTerm];

  const { data, isError, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!searchTerm) {
        return { data: [], count: 0 }; // Return empty data if searchTerm is empty
      }
      const { data, count } = await getAllVoters_Unscanned({
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
        queryKey: ["unscanned_voters", brgy, page - 1],
        queryFn: () =>
          getAllVoters_Unscanned({ brgy, page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["unscanned_voters", brgy, page - 1],
        queryFn: () =>
          getAllVoters_Unscanned({ brgy, page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [queryClient, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}

export function useElectoratesPer_BrgyAto(searchTerm) {
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

  const queryKey = ["electorates2", brgy, page, searchTerm];

  const {
    data,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getElectorates_Ato_Per_Brgy({
        brgy,
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
        queryKey: ["electorates2", brgy, page - 1],
        queryFn: () =>
          getElectorates_Ato_Per_Brgy({ brgy, page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["electorates2", brgy, page - 1],
        queryFn: () =>
          getElectorates_Ato_Per_Brgy({ brgy, page: page - 1, searchTerm }),
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [queryClient, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}
