import styled, { css } from "styled-components";

// const StyledFormRow = styled.div`
//   display: grid;
//   align-items: center;
//   grid-template-columns: 24rem 1fr 1.2fr;
//   gap: 2.4rem;

//   padding: 1.2rem 0;

//   &:first-child {
//     padding-top: 0;
//   }

//   &:last-child {
//     padding-bottom: 0;
//   }

//   &:not(:last-child) {
//     border-bottom: 1px solid var(--color-grey-100);
//   }

//   &:has(button) {
//     display: flex;
//     justify-content: flex-end;
//     gap: 1.2rem;
//   }
// `;

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;
  padding: 1.2rem 0;
  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    padding-bottom: 0;
  }
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
  &:has(button) {
    display: flex;
    /* justify-content: flex-end; */
    gap: 1.2rem;
  }

  /* Conditionally applying grid-template-columns and gap */
  ${(props) =>
    !props.customGridText &&
    css`
      display: grid;
      grid-template-columns: 16rem 2fr 1fr; /* Adjusted column sizes */
      gap: 2.4rem;
    `}
`;
// const Label = styled.label`
//   font-weight: 500;
//   padding-left: 4rem;
// `;
const Label = styled.label`
  font-weight: 500;
  padding-left: 4rem;
  ${(props) =>
    props.hasButton &&
    css`
      width: 200px; /* Set the desired width when there is a button */
    `}
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

function FormRow({ label, error, children, customGridText, button }) {
  return (
    <StyledFormRow customGridText={customGridText} hasButton={!!button}>
      {label && (
        <Label hasButton={!!button} htmlFor={children.props.id}>
          {label}
        </Label>
      )}
      {children}
      {button && <div>{button}</div>}
      {error && (
        <Error>
          <p className="mt-2 rounded-md bg-red-100 p-2 text-md text-red-700">
            {error}
          </p>
        </Error>
      )}
    </StyledFormRow>
  );
}

export default FormRow;
