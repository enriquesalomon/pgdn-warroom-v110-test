import styled from "styled-components";
import LoginForm from "../features/authentication/components/LoginForm";
import Logo from "../ui/Logo";
import CopyrightNotice from "../ui/CopyrightNotice";
import Heading from "../ui/Heading";
import GMap from "../features/map/Gmap";
import Heatmap from "../features/heatmap/HeatMap";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
`;

function Gmap() {
  return <GMap />;
}

export default Gmap;
