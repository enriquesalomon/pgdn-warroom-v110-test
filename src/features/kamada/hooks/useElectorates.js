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
  getCountPerBrgy_Summary,
  getSurveyResult,
  getNotTeamResult,
  getcount_LP_LM_LDC_W,
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
export function useSurveyResult() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation") || "Survey";
  const {
    isPending,
    data: survey_result,
    error,
  } = useQuery({
    queryKey: ["survey_result"],
    queryFn: ({ queryKey }) => getSurveyResult(),
  });

  return { isPending, survey_result, error };
}
export function useCount_LP_LM_LDC_W() {
  const {
    isPending,
    data: count_LP_LM_LDC_W,
    error,
  } = useQuery({
    queryKey: ["count_LP_LM_LDC_W"],
    queryFn: ({ queryKey }) => getcount_LP_LM_LDC_W(),
  });

  return { isPending, count_LP_LM_LDC_W, error };
}
export function useNotTeamTagResult() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation") || "1v";
  const {
    isPending,
    data: not_team_result,
    error,
  } = useQuery({
    queryKey: ["not_team_result", validationType],
    // queryFn: ({ queryKey }) => getNotTeamResult(),
    queryFn: () => getNotTeamResult(validationType),
  });

  return { isPending, not_team_result, error };
}
export function useTotal_Count_Summaru_PerBrgy() {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation") || "Survey";
  const { isPending, data, error } = useQuery({
    queryKey: ["total_count_summaru_per_brgy", validationType],
    queryFn: () => getCountPerBrgy_Summary(validationType),
  });

  return { isPending, data, error };
}
