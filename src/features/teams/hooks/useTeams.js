import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getElectorates_forLeaders,
  getTeams,
  getTeamsWithMembers,
} from "../../../services/apiTeams";
import { useSearchParams } from "react-router-dom";
import { barangayOptions, PAGE_SIZE } from "../../../utils/constants";
import { useEffect, useState } from "react";
import { getLeaders } from "../../../services/apiLeader";
import supabase from "../../../services/supabase";

export function useTeams() {
  // QUERY
  const {
    isPending,
    data: { data: teams, count } = {},
    error,
  } = useQuery({
    queryKey: ["teams"],
    queryFn: ({ queryKey }) => getTeams(),
  });

  return { isPending, error, teams, count };
}

export function useTeamsWithMembers() {
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  // FILTER
  const filterValue = searchParams.get("status");
  const filter =
    !filterValue || filterValue === "all"
      ? null
      : { field: "status", value: filterValue };

  // QUERY
  const {
    isPending,
    data: { data: teams, count } = {},
    error,
  } = useQuery({
    queryKey: ["teams", brgy],
    queryFn: () => getTeamsWithMembers({ filter, brgy }),
  });

  return { isPending, error, teams, count };
}

///--------------------------------------------------
export function useElectoratesForLeaders(searchTerm) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("modal_tbl_page")
    ? 1
    : Number(searchParams.get("modal_tbl_page"));

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState(null);
  const [electorates, setElectorates] = useState([]);
  const [count, setCount] = useState(0);

  const queryKey = ["electorate_for_leaders", brgy, page, searchTerm];

  const { data, isError, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!searchTerm) {
        return { data: [], count: 0 }; // Return empty data when searchTerm is empty
      }
      const { data, count } = await getElectorates_forLeaders({
        brgy,
        page,
        searchTerm,
      });
      return { data, count };
    },
    enabled: !!searchTerm, // Only fetch if searchTerm is not empty
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
    keepPreviousData: true,
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
        queryKey: ["electorate_for_leaders", brgy, page + 1, searchTerm],
        queryFn: () =>
          getElectorates_forLeaders({ brgy, page: page + 1, searchTerm }),
        // staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["electorate_for_leaders", brgy, page - 1, searchTerm],
        queryFn: () =>
          getElectorates_forLeaders({ brgy, page: page - 1, searchTerm }),
        // staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [queryClient, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}
//old and working
// export function useElectoratesForLeaders(searchTerm) {
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

//   const queryKey = ["electorate_for_leaders", brgy, page, searchTerm];

//   const {
//     data,
//     isError,
//     isPending: isLoading,
//   } = useQuery({
//     queryKey,
//     queryFn: async () => {
//       const { data, count } = await getElectorates_forLeaders({
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
//         queryKey: ["electorate_for_leaders", brgy, page - 1],
//         queryFn: () =>
//           getElectorates_forLeaders({ brgy, page: page - 1, searchTerm }),
//         // staleTime: 5 * 60 * 1000, // 5 minutes
//       });
//     }

//     // Prefetch previous page
//     if (page > 1) {
//       queryClient.prefetchQuery({
//         queryKey: ["electorate_for_leaders", brgy, page - 1],
//         queryFn: () =>
//           getElectorates_forLeaders({ brgy, page: page - 1, searchTerm }),
//         // staleTime: 5 * 60 * 1000, // 5 minutes
//       });
//     }
//   }, [queryClient, brgy, page, searchTerm, pageCount]);

//   return { isPending: isLoading, error, electorates, count };
// }
///--------------------------------------------------
export function useLeaders(searchTerm, type) {
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

  const queryKey = ["electorate_leaders", type, brgy, page, searchTerm];

  const {
    data,
    isError,
    isPending: isLoading,
  } = useQuery({
    queryKey,
    queryFn: async () => {
      const { data, count } = await getLeaders({
        type,
        brgy,
        page,
        searchTerm,
      });
      return { data, count };
    },
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
        queryKey: ["electorate_leaders", type, brgy, page - 1],
        queryFn: () => getLeaders({ type, brgy, page: page - 1, searchTerm }),
        // staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }

    // Prefetch previous page
    if (page > 1) {
      queryClient.prefetchQuery({
        queryKey: ["electorate_leaders", type, brgy, page - 1],
        queryFn: () => getLeaders({ type, brgy, page: page - 1, searchTerm }),
        // staleTime: 5 * 60 * 1000, // 5 minutes
      });
    }
  }, [queryClient, type, brgy, page, searchTerm, pageCount]);

  return { isPending: isLoading, error, electorates, count };
}

const fetchNames = async (id) => {
  let { data, error } = await supabase
    .from("electorates")
    .select("id,precinctno")
    .eq("id", id);

  if (error) throw new Error(error.message);
  return data;
};

export const useTower = (parameter) => {
  return useQuery({
    queryKey: ["tower", parameter],
    queryFn: () => fetchNames(parameter),
    enabled: !!parameter, // This ensures the second query only runs if parameter is provided
  });
};

const fetchSecondSelectData = async (precinctleader) => {
  let { data, error } = await supabase
    .from("electorates")
    .select(
      "id,precinctno,firstname,middlename,lastname,purok,brgy,isleader_type"
    )
    .eq("precinctleader", precinctleader)
    .is("isleader", null)
    .order("lastname", { ascending: true });
  if (error) throw new Error(error.message);
  return data;
};

export const useGetMembers = (parameter) => {
  return useQuery({
    queryKey: ["team_members_to_print", parameter],
    queryFn: () => fetchSecondSelectData(parameter),
    enabled: !!parameter, // This ensures the second query only runs if parameter is provided
  });
};
