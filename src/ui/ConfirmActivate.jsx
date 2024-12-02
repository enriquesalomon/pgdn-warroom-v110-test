import styled from "styled-components";
import Button from "./Button";
import Heading from "./Heading";

const StyledConfirmActivate = styled.div`
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

function ConfirmActivate({ resourceName, onConfirm, disabled, onCloseModal }) {
  const handleConfirm = async () => {
    // Call the onConfirm callback function
    await onConfirm();

    // If the onConfirm function succeeds, close the modal
    onCloseModal && onCloseModal();
  };
  return (
    <StyledConfirmActivate>
      <Heading as="h3">Activating {resourceName}</Heading>
      <p>Are you sure you want to activate this {resourceName} ?.</p>

      <div>
        <Button
          variation="secondary"
          disabled={disabled}
          onClick={onCloseModal}
        >
          Cancel
        </Button>
        <Button variation="primary" disabled={disabled} onClick={handleConfirm}>
          Activate
        </Button>
      </div>
    </StyledConfirmActivate>
  );
}

export default ConfirmActivate;
