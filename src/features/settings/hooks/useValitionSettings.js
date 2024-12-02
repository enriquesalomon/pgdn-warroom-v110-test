import { useQuery } from "@tanstack/react-query";
import { getValidationSettings } from "../../../services/apiSettings";

export function useValidationSettings() {
  const {
    isPending: isPending2,
    error,
    data: validation_settings,
  } = useQuery({
    queryKey: ["settings_validation"],
    queryFn: getValidationSettings,
  });

  return { isPending2, error, validation_settings };
}
