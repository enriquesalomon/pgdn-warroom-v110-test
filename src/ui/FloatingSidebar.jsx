import React from "react";
import styled from "styled-components";
import Sidebar from "./Sidebar";
import { FaTimes } from "react-icons/fa";

const StyledFloatingSidebar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 24rem; /* Set width for the floating sidebar */
  background-color: var(--color-grey-0);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
`;
const CloseButton = styled.button`
  align-self: flex-end;
  padding: 0.5rem;
  margin: 1rem;
  background: none;
  border: none;
  cursor: pointer;
`;
const FloatingSidebar = ({ onClose }) => {
  return (
    <StyledFloatingSidebar>
      <CloseButton onClick={onClose}>
        <FaTimes size={24} /> {/* Close icon with a size of 24 */}
      </CloseButton>
      <Sidebar onClose={onClose} />
    </StyledFloatingSidebar>
  );
};

export default FloatingSidebar;
