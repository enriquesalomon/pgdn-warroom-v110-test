import styled from "styled-components";
import { useDarkMode } from "../context/DarkModeContext";

const StyledLogo = styled.div`
  text-align: center;
  img {
    border: 0.2px solid #e5e7eb; /* Adjust the border size and color as needed */
    /* border-radius: 50%; Optional: to make the image circular */
  }
`;

const Img = styled.img`
  height: 12.6rem;
  width: auto;
`;

function Logo({ isZoom = false }) {
  let classParams =
    isZoom === true
      ? "flex justify-center transition-transform duration-300 ease-in-out transform hover:scale-110"
      : "flex justify-center";
  const { isDarkMode } = useDarkMode();

  const src = isDarkMode ? "/logo.png" : "/logo.png";
  //-->
  // THIS WILL BE USED IN BUILDING AND PACKAGING TO ELECTRON APP
  // const src = isDarkMode ? "./logo.png" : "./logo.png";
  //<--
  return (
    <StyledLogo>
      <div className={classParams}>
        <Img src={src} alt="Logo" />
      </div>
    </StyledLogo>
  );
}

export default Logo;
