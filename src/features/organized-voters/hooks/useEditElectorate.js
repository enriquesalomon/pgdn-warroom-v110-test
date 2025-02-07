import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditElectorate } from "../../../services/apiElectorates";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { barangayOptions } from "../../../utils/constants";

export function useEditElectorate(searchText) {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const searchTerm = searchParams.get("searchTerm") || searchText;

  const { mutate: editElectorate, isPending: isEditing } = useMutation({
    mutationFn: ({ newElectorateData, id }) =>
      createEditElectorate(newElectorateData, id),
    onSuccess: () => {
      toast.success("Electorate details successfully edited");
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editElectorate };
}
