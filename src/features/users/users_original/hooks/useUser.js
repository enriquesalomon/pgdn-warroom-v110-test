import { useQuery } from "@tanstack/react-query";
import { getUsersAdmin } from "../../../../services/apiUsers";

export function useUser() {
  const {
    isPending,
    data: users,
    error,
  } = useQuery({
    queryKey: ["users_admin"],
    queryFn: getUsersAdmin,
  });

  return { isPending, error, users };
}
