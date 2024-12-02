import { useQuery } from "@tanstack/react-query";
import {
  getCurrentUser,
  getCurrentUser_LoggedIn,
} from "../../../services/apiAuth";

export function useUser() {
  const { isPending, data: user } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
  });

  return { isPending, user, isAuthenticated: user?.role === "authenticated" };
}

export function useLogedInUser(id) {
  const { isPending, data } = useQuery({
    queryKey: ["user_loggedIn", id],
    queryFn: ({ queryKey }) => getCurrentUser_LoggedIn(id),
    staleTime: 30 * 60 * 1000, // 30mins
  });
  return { isPending, data };
}
