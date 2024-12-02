import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createEditSector } from "../../../services/apiSector";
import { useSearchParams } from "react-router-dom";
import { barangayOptions } from "../../../utils/constants";

export function useCreatePrecinct() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const { mutate: createSector, isPending: isCreating } = useMutation({
    mutationFn: createEditSector,
    onSuccess: () => {
      toast.success("New Sector successfully created");
      // queryClient.invalidateQueries({ queryKey: ["electorates"] });
      queryClient.invalidateQueries({
        queryKey: ["sector", page],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createSector };
}
