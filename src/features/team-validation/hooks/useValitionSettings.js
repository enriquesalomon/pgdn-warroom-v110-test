import { useQuery } from "@tanstack/react-query";
import { getValidationSettings_Running } from "../../../services/apiSettings";

export function useValidationSettings_Running() {
  const {
    isPending: isPending2,
    error,
    data: validation_settings,
  } = useQuery({
    queryKey: ["settings_validation_running"],
    queryFn: getValidationSettings_Running,
  });

  return { isPending2, error, validation_settings };
}
