import styled from "styled-components";
import LoginForm from "../features/authentication/components/LoginForm";
import Logo from "../ui/Logo";
import CopyrightNotice from "../ui/CopyrightNotice";
import Heading from "../ui/Heading";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
`;

function Login() {
  // const { isDarkMode, toggleDarkMode } = useDarkMode();
  // useEffect(() => {
  //   localStorage.removeItem("isDarkMode");
  //   // toggleDarkMode();
  // });
  return (
    <LoginLayout>
      <Logo />
      <Heading as="h4">Log in to your account</Heading>
      <LoginForm />
      <div>
        <CopyrightNotice />
      </div>
    </LoginLayout>
  );
}

export default Login;
