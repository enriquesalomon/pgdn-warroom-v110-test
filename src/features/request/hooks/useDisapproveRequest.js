import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { disapproveTeam_Request } from "../../../services/apiRequest";

export function useDisapproveTeam() {
  const queryClient = useQueryClient();

  const { mutate: disapproveTeam, isPending: isCreating2 } = useMutation({
    mutationFn: ({ editData, id }) => disapproveTeam_Request(editData, id),
    onSuccess: () => {
      toast.success("Request successfully disapproved.");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["requests", "COMPLETED"] });
      queryClient.invalidateQueries({ queryKey: ["requests", "PENDING"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating2, disapproveTeam };
}
