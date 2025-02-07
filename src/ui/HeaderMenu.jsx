import styled from "styled-components";
import Logout from "../features/authentication/components/Logout";
import ButtonIcon from "./ButtonIcon";
import { HiUser } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import DarkModeToggle from "./DarkModeToggle";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { parsePage } from "../utils/helpers";
// import NotiIcon from "./NotiIcon";
// import { useCheckReq } from "../features/request/hooks/useRequest";

const StyledHeaderMenu = styled.ul`
  display: flex;
  gap: 0.6rem;
`;

function HeaderMenu() {
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "account");
  // const isAllowed_req = parsePage(pagePermission, "team_request");
  const navigate = useNavigate();
  // const { count } = useCheckReq();
  return (
    <StyledHeaderMenu>
      {isAllowed ? (
        <li>
          <ButtonIcon onClick={() => navigate("/account")}>
            <HiUser />
          </ButtonIcon>
        </li>
      ) : null}

      <li>
        <DarkModeToggle />
      </li>
      {/* {isAllowed_req && count > 0 && (
        <li>
          <NotiIcon />
        </li>
      )} */}
      <li>
        <Logout />
      </li>
    </StyledHeaderMenu>
  );
}

export default HeaderMenu;
