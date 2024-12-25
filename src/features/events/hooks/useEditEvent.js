import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditEvent } from "../../../services/apiEvents";
import { toast } from "react-hot-toast";
import { useSearchParams } from "react-router-dom";

export function useEditEvent() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const page = !searchParams.get("page") ? 1 : Number(searchParams.get("page"));

  const { mutate: editEvent, isPending: isEditing } = useMutation({
    mutationFn: ({ newElectorateData, id }) =>
      createEditEvent(newElectorateData, id),
    onSuccess: () => {
      toast.success("Event successfully edited");
      // queryClient.invalidateQueries({ queryKey: ["electorates"] });
      queryClient.invalidateQueries({
        queryKey: ["events", page],
      });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isEditing, editEvent };
}
