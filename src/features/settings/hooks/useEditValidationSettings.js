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
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editValidation };
}
