import { useQuery } from "@tanstack/react-query";
import {
  getCountElectorates,
  getCountValidated,
  getCountUnValidated,
  getCountAto,
  getCountDili,
  getCountUndecided,
  getCountDeceased,
  getCountPerBrgy,
  getKamadaResult,
  getCountOT,
  getCountINC,
  getCountJEHOVAH,
  getCountPerBrgy_Unvalidated,
  getCountAto_groundLeaders,
  getCountPerBrgy_Summary,
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
    queryFn: () => getCountValidated(validationType),
  });

  return { isPending, data, error };
}

export function useTotalUnValidated() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_UnValidated", validationType],
    queryFn: () => getCountUnValidated(validationType),
  });

  return { isPending, data, error };
}

export function useTotalAto() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_Ato", validationType],
    queryFn: () => getCountAto(validationType),
  });

  return { isPending, data, error };
}

export function useTotalDili() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_Dili", validationType],
    queryFn: () => getCountDili(validationType),
  });

  return { isPending, data, error };
}

export function useTotalUndecided() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_Undecided", validationType],
    queryFn: () => getCountUndecided(validationType),
  });

  return { isPending, data, error };
}
export function useTotalDeceased() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_Deceased", validationType],
    queryFn: () => getCountDeceased(validationType),
  });

  return { isPending, data, error };
}

export function useTotalOT() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_OT", validationType],
    queryFn: () => getCountOT(validationType),
  });

  return { isPending, data, error };
}

export function useTotalINC() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_INC", validationType],
    queryFn: () => getCountINC(validationType),
  });

  return { isPending, data, error };
}

export function useTotalJEHOVAH() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_JEHOVAH", validationType],
    queryFn: () => getCountJEHOVAH(validationType),
  });

  return { isPending, data, error };
}
export function useTotalPerBrgy() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_PerBrgy", validationType],
    queryFn: () => getCountPerBrgy(validationType),
  });

  return { isPending, data, error };
}
export function useTotalPerBrgy_Unvalidated() {
  const { isPending, data, error } = useQuery({
    queryKey: ["total_PerBrgy_Unvalidated"],
    queryFn: () => getCountPerBrgy_Unvalidated(),
  });

  return { isPending, data, error };
}

export function useKamadaResult() {
  const {
    isPending,
    data: kamada_result,
    error,
  } = useQuery({
    queryKey: ["kamada_result"],
    queryFn: getKamadaResult,
  });

  return { isPending, kamada_result, error };
}

export function useTotal_AtoGroundLeaders() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_ground_leaders_ato", validationType],
    queryFn: () => getCountAto_groundLeaders(validationType),
  });

  return { isPending, data, error };
}
export function useTotal_Count_Summaru_PerBrgy() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation");
  const { isPending, data, error } = useQuery({
    queryKey: ["total_count_summaru_per_brgy", validationType],
    queryFn: () => getCountPerBrgy_Summary(validationType),
  });

  return { isPending, data, error };
}
