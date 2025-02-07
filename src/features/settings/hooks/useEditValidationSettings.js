import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditValidationSetting } from "../../../services/apiSettings";
import { toast } from "react-hot-toast";

export function useEditValidationSettings() {
  const queryClient = useQueryClient();

  const { mutate: editValidation, isPending: isEditing } = useMutation({
    mutationFn: ({ newData, id }) => createEditValidationSetting(newData, id),
    onSuccess: () => {
      toast.success("Validation Configuration successfully updated");
      queryClient.invalidateQueries({ queryKey: ["settings_validation"] });
      queryClient.invalidateQueries({ queryKey: ["validation_setter"] });
      //recache data in the voters monitoring when the settings is updated
      queryClient.invalidateQueries({ queryKey: ["total_Voters"] });
      queryClient.invalidateQueries({ queryKey: ["total_Scanned"] });
      queryClient.invalidateQueries({ queryKey: ["total_Scanned_PerBrgy"] });
      queryClient.invalidateQueries({ queryKey: ["total_Ato_PerBrgy"] });
      queryClient.invalidateQueries({ queryKey: ["latest_Scanned"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editValidation };
}
