import EventForm from "./EventForm";
import {
  HiOutlineUserMinus,
  HiOutlineUserPlus,
  HiPencil,
  HiTrash,
} from "react-icons/hi2";
import Modal from "../../../ui/Modal";
import ConfirmDelete from "../../../ui/ConfirmDelete";
import Table from "../../../ui/Table";
import Menus from "../../../ui/Menus";
import { useActionPermissionContext } from "../../../context/ActionPermissionContext";
import Tag from "../../../ui/Tag";
import { useQueryClient } from "@tanstack/react-query";
import { insertLogs } from "../../../utils/recordUserActivity";
import { convertTo12HourFormat, parseAction } from "../../../utils/helpers";
import { format } from "date-fns";
import styled from "styled-components";
import { useEventType } from "../hooks/useEvent";
import { useDeleteEvent } from "../hooks/useDeleteEvent";
import ConfirmDeactivate from "../../../ui/ConfirmDeactivate";
import ConfirmActivate from "../../../ui/ConfirmActivate";
import { useActivateEvent } from "./../hooks/useActivateEvent";
import { useDeactivateEvent } from "./../hooks/useDeactivateUser";
const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;
function EventRow({ events, index }) {
  const { eventtype } = useEventType();
  const queryClient = useQueryClient();
  console.log("0000", eventtype);
  const userData = queryClient.getQueryData(["user"]);
  const { actionPermission } = useActionPermissionContext();
  const isAllowedActionActivation = parseAction(
    actionPermission,
    "activation/deactivation event"
  );
  const { isDeleting, deleteEvent } = useDeleteEvent();
  const isAllowedAction = parseAction(actionPermission, "delete event");
  const {
    id,
    title,
    description,
    event_date,
    start_time,
    end_time,
    event_type,
    location,
    is_active,
    qr_use,
  } = events;
  const { isActivating, activateEvent } = useActivateEvent();
  const { isDeactivating, deactivateEvent } = useDeactivateEvent();

  return (
    <Table.Row>
      <div>{id}</div>
      <div>{event_type}</div>
      <div>{title}</div>
      <div>{description}</div>
      <Stacked>
        <span>Venue: {location}</span>
        <span>{format(new Date(event_date), "MMM dd yyyy")}</span>
        <span>
          {convertTo12HourFormat(start_time)} &rarr;{" "}
          {convertTo12HourFormat(end_time)}
        </span>
      </Stacked>
      <div>{qr_use}</div>
      {is_active && <Tag type="green">Active</Tag>}
      {!is_active && <Tag type="red">Inactive</Tag>}

      <div></div>

      <div>
        <Modal>
          <Menus.Menu>
            <Menus.Toggle id={id} />

            <Menus.List id={id}>
              {!is_active && isAllowedAction && (
                <Modal.Open opens="edit">
                  <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                </Modal.Open>
              )}
              {isAllowedActionActivation &&
                (is_active !== true ? (
                  <Modal.Open opens="activate">
                    <Menus.Button icon={<HiOutlineUserPlus />}>
                      Activate
                    </Menus.Button>
                  </Modal.Open>
                ) : (
                  <Modal.Open opens="deactivate">
                    <Menus.Button icon={<HiOutlineUserMinus />}>
                      Deactive
                    </Menus.Button>
                  </Modal.Open>
                ))}

              {!is_active && isAllowedAction ? (
                <Modal.Open opens="delete">
                  <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>
              ) : null}
            </Menus.List>

            <Modal.Window
              backdrop={true}
              name="edit"
              heightvar="70%"
              widthvar="45%"
            >
              <EventForm eventtype={eventtype} userToEdit={events} />
            </Modal.Window>

            <Modal.Window name="delete">
              <ConfirmDelete
                message={`Are you sure you want to permanently delete this event.? `}
                recordof={title}
                resourceName="Event"
                disabled={isDeleting}
                onConfirm={() => {
                  deleteEvent(id);
                  const params = {
                    page: "Event",
                    action: "User deleted an Event",
                    parameters: { name: title },
                    user_id: userData.id,
                  };
                  insertLogs(params);
                }}
              />
            </Modal.Window>

            <Modal.Window name="activate">
              <ConfirmActivate
                resourceName="Event"
                disabled={isActivating}
                onConfirm={() => {
                  activateEvent(id);
                  const params = {
                    page: "Event",
                    action: "User activated an Event",
                    parameters: { name: title },
                    user_id: userData.id,
                  };
                  insertLogs(params);
                }}
              />
            </Modal.Window>
            <Modal.Window name="deactivate">
              <ConfirmDeactivate
                resourceName="Event"
                disabled={isDeactivating}
                // onConfirm={() => deactivateUser(userId)}
                onConfirm={() => {
                  deactivateEvent(id);
                  const params = {
                    page: "Event",
                    action: "User activated an Event",
                    parameters: { name: title },
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

export default EventRow;
