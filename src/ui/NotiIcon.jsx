import { HiMoon, HiSun } from "react-icons/hi2";
import ButtonIcon from "./ButtonIcon";
import styled, { keyframes } from "styled-components";
import { MdOutlineNotificationsActive } from "react-icons/md";
const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  50% { transform: translateX(2px); }
  75% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
`;

const NotificationIcon = styled(MdOutlineNotificationsActive)`
  color: red !important;
  width: 1.5rem;
  height: 1.5rem;
  margin-left: -1rem;
  /* animation: ${shake} 0.5s infinite; */
  animation: ${shake} 2s ease-in-out infinite; /* 3s total duration with infinite repetition */
  animation-timing-function: ease-in-out; /* Smooth transition */
  //
`;
const Tooltip = styled.div`
  visibility: hidden;
  width: 220px; /* Adjust width to fit the text */
  background-color: #ffffff; /* Light color for the cloud */
  color: #333; /* Dark color for text */
  text-align: center;
  border-radius: 12px;
  padding: 10px;
  position: absolute;
  z-index: 1;
  left: -210px; /* Position to the left of the icon */
  top: 50%; /* Center vertically relative to the icon */
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow for a floating effect */

  /* Arrow styling */
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 100%; /* Position the arrow to the left side of the tooltip */
    margin-top: -5px; /* Center the arrow vertically */
    border-width: 5px;
    border-style: solid;
    border-color: transparent #f8f9fa transparent transparent; /* Match tooltip background color */
  }
`;

// const Tooltip = styled.div`
//   visibility: hidden;
//   width: 220px; /* Adjust width to fit the text */
//   background-color: #ffffff; /* White background color */
//   color: #333; /* Dark color for text */
//   text-align: center;
//   border-radius: 12px;
//   padding: 10px;
//   position: absolute;
//   z-index: 1;
//   left: -210px; /* Position to the left of the icon */
//   top: 50%; /* Center vertically relative to the icon */
//   transform: translateY(-50%);
//   opacity: 0;
//   transition: opacity 0.3s;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Soft shadow for a floating effect */
//   border: 2px solid orange; /* Orange border */

//   /* Arrow styling */
//   &::after {
//     content: "";
//     position: absolute;
//     top: 50%;
//     right: 100%; /* Position the arrow to the left side of the tooltip */
//     margin-top: -5px; /* Center the arrow vertically */
//     border-width: 5px;
//     border-style: solid;
//     border-color: transparent orange transparent transparent; /* Orange border for the arrow */
//   }
// `;

const ButtonIconWrapper = styled(ButtonIcon)`
  position: relative;
  display: inline-block;
  &:hover ${Tooltip} {
    visibility: visible;
    opacity: 1;
  }
`;
function NotiIcon() {
  return (
    <ButtonIconWrapper>
      <Tooltip>
        <span className="text-2xl text-black">There is a pending request</span>
        <br />
      </Tooltip>
      <NotificationIcon />
    </ButtonIconWrapper>
  );
}

export default NotiIcon;
