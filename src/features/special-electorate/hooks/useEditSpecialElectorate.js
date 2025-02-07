import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditSpecial } from "../../../services/apiSpecialElectorate";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { barangayOptions } from "../../../utils/constants";
import { untagSpecial as untagSpecialApi } from "../../../services/apiSpecialElectorate";
export function useEditSpecialElectorate() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const searchTerm = searchParams.get("searchTerm") || "";
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const assigned = searchParams.get("assigned") || "0";
  const { mutate: editSpecialElectorate, isPending: isEditing } = useMutation({
    mutationFn: ({ newElectorateData }) => createEditSpecial(newElectorateData),
    onSuccess: () => {
      toast.success("Successfully Tag");
      // queryClient.invalidateQueries({ queryKey: ["electorates"] });
      queryClient.invalidateQueries({
        queryKey: ["special_electorate", assigned, page, brgy, searchTerm],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editSpecialElectorate };
}

export function useUntagSpecial() {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate: untagSpecial } = useMutation({
    mutationFn: untagSpecialApi,
    onSuccess: () => {
      toast.success("Successfully Untag");

      queryClient.invalidateQueries({
        queryKey: ["special_electorate"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, untagSpecial };
}
