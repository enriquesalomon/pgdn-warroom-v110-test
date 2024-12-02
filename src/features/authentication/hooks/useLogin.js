import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { usePagePermissionContext } from "../../../context/PagePermissionContext";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import { decryptData } from "../../../utils/cryptoUtils";
import { insertLogs } from "../../../utils/recordUserActivity";
export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setPagePermission } = usePagePermissionContext(); // get the setPagePermission function from the context
  const { setActionPermission } = useActionPermissionContext();
  const { mutate: login, isPending } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user.user);

      const params = {
        page: "Login",
        action: "User Logged in",
        parameters: user.user.email,
        user_id: user.user.id,
      };
      if (user.user.email !== "adminadmin@gmail.com") {
        insertLogs(params);
      }

      const storedPermission = localStorage.getItem("page_permission");
      const cleanedString1 = storedPermission.replace(/^"(.*)"$/, "$1");
      const decrypted_page_permission = decryptData(cleanedString1);
      const storedActionsPerm = localStorage.getItem("action_permission");
      const cleanedString2 = storedActionsPerm.replace(/^"(.*)"$/, "$1");
      const decrypted_action_permission = decryptData(cleanedString2);
      setPagePermission(decrypted_page_permission); // set the page_permission in the context
      setActionPermission(decrypted_action_permission);
      navigate("/dashboard", { replace: true });
    },
    onError: (err) => {
      console.log("ERROR", err);
      toast.error("Provided email or password are incorrect");
    },
  });

  return { login, isPending };
}
