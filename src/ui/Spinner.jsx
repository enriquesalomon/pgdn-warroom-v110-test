import styled, { keyframes } from "styled-components";

const rotate = keyframes`
  to {
    transform: rotate(1turn)
  }
`;

const Spinner = styled.div`
  margin: 4.8rem auto;

  width: 6.4rem;
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(farthest-side, var(--color-orange-100) 94%, #0000)
      top/2px 2px no-repeat,
    conic-gradient(#0000 30%, var(--color-orange-100));
  -webkit-mask: radial-gradient(farthest-side, #0000 calc(100% - 5px), #000 0);
  animation: ${rotate} 1.5s infinite linear;
`;

export default Spinner;
