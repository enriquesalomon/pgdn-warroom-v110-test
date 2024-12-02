import { useQuery } from "@tanstack/react-query";
import { getSettings } from "../../../services/apiSettings";
import { checkRequest } from "../../../services/apiRequest";

export function useSettings() {
  const {
    isPending,
    error,
    data: settings,
  } = useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
  });

  return { isPending, error, settings };
}

export function useCheckRequestPending() {
  const {
    isPending,
    error,
    data: requests,
  } = useQuery({
    queryKey: ["requests_pending"],
    queryFn: checkRequest,
  });

  return { isPending, error, requests };
}
