import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import styled from "styled-components";
import { useState, useEffect } from "react";
import FloatingSidebar from "./FloatingSidebar";
const TopTitle = styled.div`
  background-color: #fef9c3; /* Updated color */
  height: 40px; /* Adjust height as needed */
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151; /* Text color */
  font-weight: bold;
`;
const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 24rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr; /* Adjust grid layout for smaller screens */
  }
`;

const Main = styled.main`
  background-color: var(--color-grey-50);
  padding: 3rem 4.8rem 6.4rem;
  overflow: scroll;
  grid-column: span 1; /* Ensure main content spans the full width on smaller screens */

  @media (max-width: 768px) {
    padding: 4rem; /* Adjust padding on smaller screens */
  }
`;

const Container = styled.div`
  /* max-width: 120rem; */
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

function AppLayout() {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    handleResize(); // Check initial screen size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };
  const closeSidebar = () => {
    setShowSidebar(false);
  };
  return (
    <>
      <TopTitle>
        👋 This is a testing server. All data is temporary and not final.
      </TopTitle>

      <StyledAppLayout>
        <Header toggleSidebar={toggleSidebar} />
        {isSmallScreen && showSidebar && (
          <FloatingSidebar onClose={closeSidebar} />
        )}
        {!isSmallScreen && <Sidebar />}
        <Main>
          <Container>
            <Outlet />
          </Container>
        </Main>
      </StyledAppLayout>
    </>
  );
}

export default AppLayout;
