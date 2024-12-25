import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { deleteAttendees as deleteAttendeesApi } from "../../../services/apiEventAttendees";
import { useInvalidateQuery } from "./useInvalidateQuery";

export function useDeleteAttendees(debouncedSearchTerm) {
  const invalidateQueries = useInvalidateQuery(debouncedSearchTerm);
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: deleteAttendees } = useMutation({
    mutationFn: deleteAttendeesApi,
    onSuccess: () => {
      toast.success("Attendees successfully removed");

      // queryClient.invalidateQueries({
      //   queryKey: ["service_avail"],
      // });
      invalidateQueries();
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, deleteAttendees };
}
