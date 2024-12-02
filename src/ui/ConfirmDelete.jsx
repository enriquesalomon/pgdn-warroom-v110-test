import styled from "styled-components";
import Button from "./Button";
import Heading from "./Heading";

const StyledConfirmDelete = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  gap: 1.2rem;

  & p {
    color: var(--color-grey-500);
    margin-bottom: 1.2rem;
  }

  & div {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

function ConfirmDelete({
  resourceName,
  onConfirm,
  disabled,
  onCloseModal,
  message = `Are you sure you want to delete this ${resourceName} permanently? This
        action cannot be undone.`,
  message2 = "",
  recordof = "",
  btnText = "Delete",
}) {
  const handleConfirm = async () => {
    // Call the onConfirm callback function
    await onConfirm();

    // If the onConfirm function succeeds, close the modal
    onCloseModal && onCloseModal();
  };
  return (
    <StyledConfirmDelete>
      <Heading as="h3">Delete {resourceName}</Heading>
      <p> {message}</p>
      {recordof && (
        <p className="  bg-[#FFA500] p-4 rounded-md shadow-md mb-4 mx-8 mt-4 text-center bg--[#FFA500] shadow-lg shadow-red-800/50">
          <span className="text-orange-50"> {recordof}</span>
        </p>
      )}
      <p>{message2}</p>

      <div>
        <Button
          variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button variation="danger" disabled={disabled} onClick={handleConfirm}>
          {btnText}
        </Button>
      </div>
    </StyledConfirmDelete>
  );
}

export default ConfirmDelete;
