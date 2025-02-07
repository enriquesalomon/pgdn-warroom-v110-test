import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditVoters } from "../../../services/apiVoters";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { barangayOptions } from "../../../utils/constants";
import { untagSpecial as untagSpecialApi } from "../../../services/apiSpecialElectorate";
export function useEditVoters() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));
  const searchTerm = searchParams.get("searchTerm") || "";
  const brgy = searchParams.get("sortBy") || barangayOptions[1].value;
  const voters_remarks = searchParams.get("voters_remarks") || "0";
  const { mutate: editSpecialElectorate, isPending: isEditing } = useMutation({
    mutationFn: ({ newElectorateData }) => createEditVoters(newElectorateData),
    onSuccess: () => {
      toast.success("Successfully Tag");
      // queryClient.invalidateQueries({ queryKey: ["electorates"] });
      queryClient.invalidateQueries({
        queryKey: [
          "manual_scanned_voters",
          voters_remarks,
          page,
          brgy,
          searchTerm,
        ],
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
      toast.success("Successfully Saved");

      queryClient.invalidateQueries({
        queryKey: ["special_electorate"],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isDeleting, untagSpecial };
}
