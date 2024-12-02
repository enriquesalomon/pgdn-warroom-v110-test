import React from "react";
import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";
import { FaBars, FaTimes } from "react-icons/fa";

const StyledSidebar = styled.aside`
  /* background-color: var(--color-grey-0); */
  background-color: orange;
  padding: 3.2rem 2.4rem;
  position: fixed;
  top: 0;
  left: ${({ visible }) =>
    visible ? "0" : "-24rem"}; /* Slide in/out from the left */
  width: 24rem;
  height: 100vh;
  transition: left 0.3s ease-in-out;
  z-index: 999; /* Ensure sidebar appears above other content */
  gap: 3.2rem;
  overflow-y: auto;
`;

const ToggleButton = styled.button`
  display: block;
  position: fixed;
  top: 2rem;
  left: 2rem;
  z-index: 999;
  background-color: var(--color-blue-500);
  color: #fff;
  border: none;
  padding: 0.8rem 1.6rem;
  border-radius: 0.4rem;
  cursor: pointer;
`;

function Sidebar({ visible, toggleSidebar }) {
  return (
    <>
      <StyledSidebar visible={visible}>
        <Logo />
        <MainNav />
      </StyledSidebar>
      {visible && (
        <ToggleButton onClick={toggleSidebar}>
          <FaTimes /> {/* Show close icon when sidebar is visible */}
        </ToggleButton>
      )}
      {!visible && (
        <ToggleButton onClick={toggleSidebar}>
          <FaBars /> {/* Show menu icon when sidebar is hidden */}
        </ToggleButton>
      )}
    </>
  );
}

export default Sidebar;
