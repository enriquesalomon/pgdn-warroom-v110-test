import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";
import { FaTimes } from "react-icons/fa";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  ${"" /* border-right: 1px solid var(--color-grey-100); */}

  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
  max-height: 100vh;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  align-self: flex-end;

  background: none;
  border: none;
  cursor: pointer;
`;
function Sidebar({ onClose, floatingsidebar }) {
  return (
    <StyledSidebar>
      {floatingsidebar && (
        <CloseButton onClick={onClose}>
          <FaTimes size={24} />
        </CloseButton>
      )}

      <Logo />
      <MainNav />
    </StyledSidebar>
  );
}

export default Sidebar;
