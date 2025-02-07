import styled from "styled-components";

const Input = styled.input`
  border: 1px solid var(--color-grey-300);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-tiny);
  padding: 0.8rem 1.2rem;
  box-shadow: var(--shadow-sm);
  ${(props) => props.mr && `margin-right: ${props.mr};`}
  ${(props) => props.width && `width: ${props.width};`} /* width: 19.7rem; */
`;

export default Input;
