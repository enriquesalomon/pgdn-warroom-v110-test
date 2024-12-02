import styled from "styled-components";

import { useMoveBack } from "../hooks/useMoveBack";
import Heading from "../ui/Heading";
import Logo from "../ui/Logo";

const StyledPageNotFound = styled.main`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4.8rem;
`;

const Box = styled.div`
  /* box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 4.8rem;
  flex: 0 1 96rem;
  text-align: center;

  & h1 {
    margin-bottom: 3.2rem;
  }
`;

function PageNotFound() {
  const moveBack = useMoveBack();

  return (
    <StyledPageNotFound>
      <div>
        <div className="mb-2">
          <Logo isZoom={true} />
        </div>
        <Box>
          <Heading as="h2">
            The page you are looking for could not be found 😢
          </Heading>
          <button
            className="mt-6 px-4 py-2 bg-[#FFA500] text-white rounded hover:bg-[#cc8400]"
            onClick={moveBack}
            size="large"
          >
            &larr; Go back
          </button>
        </Box>
      </div>
    </StyledPageNotFound>
  );
}

export default PageNotFound;
