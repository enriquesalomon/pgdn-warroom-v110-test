import { useQuery } from "@tanstack/react-query";
import { getEvents } from "../../../../services/apiEventAttendees";

export function useEvents() {
  const {
    isPending,
    data: events,
    error,
  } = useQuery({
    queryKey: ["events"],
    queryFn: getEvents,
  });

  return { isPending, error, events };
}
