import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createEditService } from "../../../services/apiServices";

export function useCreateService() {
  const queryClient = useQueryClient();

  const { mutate: createService, isPending: isCreating } = useMutation({
    mutationFn: createEditService,
    onSuccess: () => {
      toast.success("New Services avail successfully created");
      queryClient.invalidateQueries({ queryKey: ["service_avail"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createService };
}
