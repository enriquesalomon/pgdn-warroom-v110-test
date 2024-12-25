import Table from "../../../ui/Table";
// import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
// import { useQueryClient } from "@tanstack/react-query";
import { parseAction, replaceSpecialChars } from "../../../utils/helpers";

function PrecinctRow({ precinct, index }) {
  // const queryClient = useQueryClient();
  // const userData = queryClient.getQueryData(["user"]);
  // const { actionPermission } = useActionPermissionContext();
  // const { isDeleting, deleteSector } = useDeletePrecinct();
  // const isAllowedAction = parseAction(actionPermission, "delete baco");
  const { id, barangay, cluster_number, precinct: precinctno } = precinct;

  return (
    <Table.Row>
      <div>{id}</div>
      <div>{replaceSpecialChars(barangay)}</div>
      <div>{cluster_number}</div>
      <div>{precinctno}</div>
      <div></div>
    </Table.Row>
  );
}

export default PrecinctRow;
