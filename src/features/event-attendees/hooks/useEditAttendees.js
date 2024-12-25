import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditService } from "../../../services/apiServices";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { barangayOptions } from "../../../utils/constants";

export function useEditAttendees() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const searchTerm = searchParams.get("searchTerm") || "";

  const { mutate: editAttendees, isPending: isEditing } = useMutation({
    mutationFn: ({ newServicesData, id }) =>
      createEditService(newServicesData, id),
    onSuccess: () => {
      toast.success("Service Availed successfully edited");
      queryClient.invalidateQueries({
        queryKey: ["service_avail", brgy, page, searchTerm],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editAttendees };
}
