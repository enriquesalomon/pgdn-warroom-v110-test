import { useQuery } from "@tanstack/react-query";
import {
  getCountElectorates,
  getCount3rdV_ato,
  getCountScanned,
  getLatesScanned,
  getCountDili,
  getCountUndecided,
  getCountPerBrgy,
  getCountAto_VotersMonitoring,
  getCountVotersScannedPerBrgy,
} from "../../../services/apiDashboardDatas";
import { useSearchParams } from "react-router-dom";

export function useTotalElectorates() {
  const { isPending, data, error } = useQuery({
    queryKey: ["total_electorates"],
    queryFn: getCountElectorates,
  });

  return { isPending, data, error };
}
export function useTotalVoterAto() {
  // const [searchParams] = useSearchParams();
  const validationType = "3v";

  const { isPending, data, error } = useQuery({
    queryKey: ["total_Voters", validationType],
    queryFn: ({ queryKey }) => getCount3rdV_ato(validationType),
    staleTime: 5 * 60 * 1000, // 5 minute for dashboard stats
  });

  return { isPending, data, error };
}

export function useTotalScanned() {
  // const [searchParams] = useSearchParams();
  const validationType = "4finalvalidation";

  const { isPending, data, error } = useQuery({
    queryKey: ["total_Scanned", validationType],
    queryFn: ({ queryKey }) => getCountScanned(validationType),
    staleTime: 5 * 60 * 1000, // 5 minute for dashboard stats
  });

  return { isPending, data, error };
}

export function useLatesScanned() {
  // const [searchParams] = useSearchParams();
  const validationType = "4finalvalidation";

  const { isPending, data, error } = useQuery({
    queryKey: ["latest_Scanned", validationType],
    queryFn: ({ queryKey }) => getLatesScanned(validationType),
    staleTime: 5 * 60 * 1000, // 5 minute for dashboard stats
  });

  return { isPending, data, error };
}
// export function useTotalUnscanned() {
//   // const [searchParams] = useSearchParams();
//   // const validationType = searchParams.get("validation");
//   const validationType = "3v";
//   const { isPending, data, error } = useQuery({
//     queryKey: ["total_Unscanned", validationType],
//     queryFn: ({ queryKey }) => getCountUnValidated(validationType),
//   });

//   return { isPending, data, error };
// }

export function useTotalAto() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_Ato", validationType],
    queryFn: ({ queryKey }) => getCountAto_VotersMonitoring(validationType),
  });

  return { isPending, data, error };
}

export function useTotalDili() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_Dili", validationType],
    queryFn: ({ queryKey }) => getCountDili(validationType),
  });

  return { isPending, data, error };
}

export function useTotalUndecided() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_Undecided", validationType],
    queryFn: ({ queryKey }) => getCountUndecided(validationType),
  });

  return { isPending, data, error };
}

export function useTotalScannedPerBrgy() {
  // const [searchParams] = useSearchParams();
  // const validationType = searchParams.get("validation");
  const validationType = "4finalvalidation";

  const { isPending, data, error } = useQuery({
    queryKey: ["total_Scanned_PerBrgy"],
    queryFn: ({ queryKey }) => getCountVotersScannedPerBrgy(),
    staleTime: 5 * 60 * 1000, // 5 minute for dashboard stats
  });

  return { isPending, data, error };
}
export function useTotalAtoPerBrgy() {
  // const [searchParams] = useSearchParams();
  // const validationType = searchParams.get("validation");
  const validationType = "3v";

  const { isPending, data, error } = useQuery({
    queryKey: ["total_Ato_PerBrgy", validationType],
    queryFn: ({ queryKey }) => getCountPerBrgy(validationType),
    staleTime: 5 * 60 * 1000, // 5 minute for dashboard stats
  });

  return { isPending, data, error };
}
