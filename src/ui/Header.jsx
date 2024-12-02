import styled from "styled-components";
import HeaderMenu from "./HeaderMenu";
import UserAvatar from "../features/authentication/components/UserAvatar";
import { FaBars } from "react-icons/fa";
import ButtonIcon from "./ButtonIcon";
const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  /* background-color: red; */
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);

  display: flex;
  gap: 2.4rem;
  align-items: center;
  justify-content: flex-end;

  @media (min-width: 768px) {
    & > button-icon {
      display: none;
    }
  }
`;

function Header({ toggleSidebar }) {
  const isSmallScreen = window.innerWidth <= 769;
  return (
    <StyledHeader>
      {isSmallScreen && (
        <ButtonIcon onClick={toggleSidebar}>
          <FaBars className="mr-16 hover:cursor-pointer" />
        </ButtonIcon>
      )}
      <UserAvatar />
      <HeaderMenu />
    </StyledHeader>
  );
}

export default Header;
