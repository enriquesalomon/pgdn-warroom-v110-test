import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { createEditEvent } from "../../../services/apiEventType";
import { useSearchParams } from "react-router-dom";
import { barangayOptions } from "../../../utils/constants";

export function useCreateEventType() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const { mutate: createEventType, isPending: isCreating } = useMutation({
    mutationFn: createEditEvent,
    onSuccess: () => {
      toast.success("New Event Type successfully created");
      // queryClient.invalidateQueries({ queryKey: ["electorates"] });
      queryClient.invalidateQueries({
        queryKey: ["event_type", page],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, createEventType };
}
