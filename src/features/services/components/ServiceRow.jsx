import CreateBeneficiaryForm from "./CreateBeneficiaryForm";
import { HiPencil, HiTrash } from "react-icons/hi2";
import Modal from "../../../ui/Modal";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useDeleteService } from "../hooks/useDeleteService";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
import { parseAction } from "../../../utils/helpers";

function ServiceRow({ services, index }) {
  const queryClient = useQueryClient();
  const { actionPermission } = useActionPermissionContext();
  const { isDeleting, deleteService } = useDeleteService();
  const isAllowedAction = parseAction(actionPermission, "delete services");

  const userData = queryClient.getQueryData(["user"]);

  const {
    id: servicesId,
    fullname,
    barangay,
    purok,
    assistance_type,
    date_availed,
    description,
  } = services;
  return (
    <Table.Row>
      <div>{index + 1}</div>
      <div>{fullname}</div>
      <div>{barangay}</div>
      <div>{purok}</div>
      <div>{assistance_type}</div>
      <div>{date_availed}</div>
      <div className="truncate max-w-lg">{description}</div>
      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={servicesId} />

            <Menus.List id={servicesId}>
              <Modal.Open opens="edit">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>
              {isAllowedAction && (
                <Modal.Open opens="delete">
                  <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>
              )}
              {/* <Modal.Open opens="delete">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open> */}
            </Menus.List>

            <Modal.Window backdrop={true} name="edit" heightvar="85%">
              <CreateBeneficiaryForm
                servicetoEdit={services}
                // electorates={electorates}
              />
            </Modal.Window>
            <Modal.Window name="delete">
              <ConfirmDelete
                resourceName="service availed"
                disabled={isDeleting}
                onConfirm={() => {
                  deleteService(servicesId);
                  const params = {
                    page: "Services",
                    action: "User delete a service record availment",
                    user_id: userData.id,
                  };
                  insertLogs(params);
                }}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </div>
    </Table.Row>
  );
}

export default ServiceRow;
