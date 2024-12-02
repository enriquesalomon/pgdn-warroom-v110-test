import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { useSearchParams } from "react-router-dom";

const StyledModal = styled.div`
  width: ${(props) => props.width || ""};
  /* height: 100%; Full height */
  height: ${(props) =>
    props.height || "auto"}; /* Use the provided height or 'auto' */
  overflow: auto; /* Enable scroll if needed */
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  /* background-color: var(--color-green-700); */
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem 2rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
  /* Responsive styles */
  @media (max-width: 640px) {
    margin-right: 7rem;
  }
`;

const ModalContext = createContext();

function Modal({ children }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);

  return cloneElement(children, { onClick: () => open(opensWindowName) });
}

function Window({ children, name, heightvar, widthvar, backdrop }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const { openName, close } = useContext(ModalContext);
  let ref = useOutsideClick(close);
  if (backdrop) {
    ref = null;
  }

  if (name !== openName) return null;
  const handleClose = () => {
    searchParams.delete("page");
    setSearchParams(searchParams);
    close();
  };

  return createPortal(
    <Overlay>
      <StyledModal ref={ref} height={heightvar} width={widthvar}>
        <Button onClick={handleClose}>
          <HiXMark />
        </Button>

        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
