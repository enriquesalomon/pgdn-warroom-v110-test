import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {
  approveMem_remarks_Request,
  approveTeam_add_Request,
  approveTeam_delist_Request,
  approveTeam_listing_Request,
} from "../../../services/apiRequest";

export function useApproveTeam_add() {
  const queryClient = useQueryClient();

  const { mutate: approveTeam, isPending: isCreating } = useMutation({
    mutationFn: approveTeam_add_Request,
    onSuccess: () => {
      toast.success("New Team creation successfully approved");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["requests", "COMPLETED"] });
      queryClient.invalidateQueries({ queryKey: ["requests", "PENDING"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, approveTeam };
}

export function useApproveTeam_delist() {
  const queryClient = useQueryClient();

  const { mutate: approveTeam, isPending: isCreating } = useMutation({
    mutationFn: approveTeam_delist_Request,
    onSuccess: () => {
      toast.success("Team Delisting is successfully approved");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["requests", "COMPLETED"] });
      queryClient.invalidateQueries({ queryKey: ["requests", "PENDING"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, approveTeam };
}

export function useApproveTeam_listing() {
  const queryClient = useQueryClient();

  const { mutate: approveTeam, isPending: isCreating } = useMutation({
    mutationFn: approveTeam_listing_Request,
    onSuccess: () => {
      toast.success("Team listing is successfully approved");
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["requests", "COMPLETED"] });
      queryClient.invalidateQueries({ queryKey: ["requests", "PENDING"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, approveTeam };
}

export function useApproveMember_Remarks() {
  const queryClient = useQueryClient();

  const { mutate: approveMembers, isPending: isCreating } = useMutation({
    mutationFn: approveMem_remarks_Request,
    onSuccess: () => {
      toast.success(
        "Special Electorates Tagging Request is successfully approved"
      );
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      queryClient.invalidateQueries({ queryKey: ["requests", "COMPLETED"] });
      queryClient.invalidateQueries({ queryKey: ["requests", "PENDING"] });
    },
    onError: (err) => toast.error(err.message),
  });

  return { isCreating, approveMembers };
}
