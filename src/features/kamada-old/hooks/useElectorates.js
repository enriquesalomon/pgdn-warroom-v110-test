import { useQuery } from "@tanstack/react-query";
import {
  getCountElectorates,
  getCountValidated,
  getCountUnValidated,
  getCountAto,
  getCountDili,
  getCountUndecided,
  getCountPerBrgy,
  getKamadaResult,
} from "../../../services/apiDashboardDatas";
import { useSearchParams } from "react-router-dom";

export function useTotalElectorates() {
  const { isPending, data, error } = useQuery({
    queryKey: ["total_electorates"],
    queryFn: getCountElectorates,
  });

  return { isPending, data, error };
}
export function useTotalValidated() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");

  const { isPending, data, error } = useQuery({
    queryKey: ["total_Validated", validationType],
    queryFn: ({ queryKey }) => getCountValidated(validationType),
  });

  return { isPending, data, error };
}

export function useTotalUnValidated() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_UnValidated", validationType],
    queryFn: ({ queryKey }) => getCountUnValidated(validationType),
  });

  return { isPending, data, error };
}

export function useTotalAto() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_Ato", validationType],
    queryFn: ({ queryKey }) => getCountAto(validationType),
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

export function useTotalPerBrgy() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_PerBrgy", validationType],
    queryFn: ({ queryKey }) => getCountPerBrgy(validationType),
  });

  return { isPending, data, error };
}

export function useKamadaResult() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const {
    isPending,
    data: kamada_result,
    error,
  } = useQuery({
    queryKey: ["kamada_result", validationType],
    queryFn: ({ queryKey }) => getKamadaResult(validationType),
  });

  return { isPending, kamada_result, error };
}
