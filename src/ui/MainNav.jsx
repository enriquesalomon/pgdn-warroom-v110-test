import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { NavLink } from "react-router-dom";
import { GiReceiveMoney } from "react-icons/gi";
import { IoAnalyticsSharp } from "react-icons/io5";
import { IoMdAnalytics } from "react-icons/io";
import { PiUserListLight } from "react-icons/pi";
import { LiaUserTagSolid } from "react-icons/lia";
import { MdOutlineNotificationsActive } from "react-icons/md";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { parsePagePermission } from "../utils/helpers";
import { useDebounce } from "use-debounce";
import { IoIosArrowDown } from "react-icons/io";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { TbFileReport } from "react-icons/tb";
import { PiCirclesThreePlusBold } from "react-icons/pi";
import { FaPersonChalkboard } from "react-icons/fa6";
import { LiaMapMarkedAltSolid } from "react-icons/lia";
import { RiSurveyLine } from "react-icons/ri";
import { MdOutlineEvent } from "react-icons/md";
// Keyframes for shaking animation
const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-2px); }
  50% { transform: translateX(2px); }
  75% { transform: translateX(-2px); }
  100% { transform: translateX(0); }
`;

const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  /* gap: 0.8rem; */
`;

const StyledNavLink = styled(NavLink)`
  position: relative; /* Ensure the pseudo-element is positioned relative to this container */

  &:link,
  &:visited {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    color: var(--color-grey-600);
    font-size: 1.2rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  &:hover,
  &:active,
  &.active:link,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-100);
    /* border-radius: var(--border-radius-sm); */
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  &:hover svg,
  &:active svg,
  &.active:link svg,
  &.active:visited svg {
    color: var(--color-green-500);
  }

  /* Conditionally add the vertical line */
  ${(props) =>
    props.showverticalline &&
    `
    &::before {
      content: "";
      position: absolute;
      left: 0; /* Align with the left edge */
      top: 0;
      bottom: 0;
      width: 0.5px; /* Thickness of the line */
      background-color: #e5e7eb; /* Color of the line */
    }
  `}
`;

// const StyledNavLink = styled(NavLink)`
//   &:link,
//   &:visited {
//     display: flex;
//     align-items: center;
//     gap: 1.2rem;
//     color: var(--color-grey-600);
//     font-size: 1.2rem;
//     font-weight: 500;
//     padding: 1.2rem 2.4rem;
//     transition: all 0.3s;
//   }

//   &:hover,
//   &:active,
//   &.active:link,
//   &.active:visited {
//     color: var(--color-grey-800);
//     background-color: var(--color-grey-100);
//     border-radius: var(--border-radius-sm);
//   }

//   & svg {
//     width: 2.4rem;
//     height: 2.4rem;
//     color: var(--color-grey-400);
//     transition: all 0.3s;
//   }

//   &:hover svg,
//   &:active svg,
//   &.active:link svg,
//   &.active:visited svg {
//     color: var(--color-orange-500);
//   }
// `;
const StyledNavLinkCollapsable = styled(NavLink)`
  &:link,
  &:visited {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1.2rem;
    color: var(--color-green-600);
    font-size: 1.2rem;
    font-weight: 500;
    padding: 1.2rem 2.4rem;
    transition: all 0.3s;
  }

  &:hover,
  &:active,
  &.active:visited {
    color: var(--color-grey-800);
    background-color: var(--color-grey-100);
    border-radius: var(--border-radius-sm);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-400);
    transition: all 0.3s;
  }

  ${(props) =>
    props.isactives &&
    `
    &.active:visited svg {
      color: var(--color-green-500);
    }
  `}
`;
const LabelWithIconContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.2rem; /* Adjust gap between icon and label */
`;

const NotificationIcon = styled(MdOutlineNotificationsActive)`
  /* color: red !important;
  width: 1.5rem;
  height: 1.5rem;
  margin-left: -1rem;
  animation: ${shake} 0.5s infinite; */
  color: red !important;
  width: 1.5rem;
  height: 1.5rem;
  margin-left: -1rem;
  /* animation: ${shake} 0.5s infinite; */
  animation: ${shake} 2s ease-in-out infinite; /* 3s total duration with infinite repetition */
  animation-timing-function: ease-in-out; /* Smooth transition */
  //
`;

function MainNav() {
  const [debouncedSearchTerm] = useDebounce("", 500);
  // const { count } = useRequests(debouncedSearchTerm, "PENDING");
  const { pagePermission } = usePagePermissionContext();
  const permissions = parsePagePermission(pagePermission);
  permissions.push(
    "rpt_electorate_LP_LM_LDC_W",
    "rpt_survey",
    "rpt_leader_list",
    "goldaffiliate_id"
  );

  const [activeCollapse, setActiveCollapse] = useState("");

  const toggleCollapse = (collapseName) => {
    setActiveCollapse((prev) => (prev === collapseName ? "" : collapseName));
  };

  const sidebarLinks_dashboard = [
    {
      route: "/dashboard",
      icon: <IoMdAnalytics />,
      label: "DASHBOARD",
      showverticalline: false,
    },
    {
      route: "/kamada",
      icon: <IoAnalyticsSharp />,
      label: "KAMADA",
      showverticalline: false,
    },
    {
      route: "/gmap",
      icon: <LiaMapMarkedAltSolid />,
      label: "MAP",
      showverticalline: false,
    },
  ];

  const sidebarLinks_operation = [
    {
      route: "/electorate",
      // icon: <RiAccountPinBoxLine />,
      label: "Electorates",
      showverticalline: true,
    },
    {
      route: "/electorate_classification",
      // icon: <RiAccountPinBoxLine />,
      label: "Electorate Survey",
      showverticalline: true,
    },

    {
      route: "/teams",
      //  icon: <GiDarkSquad />,
      label: "Teams",
      showverticalline: true,
    },
    {
      route: "/team_validation",
      //  icon: <GiDarkSquad />,
      label: "Team Validation",
      showverticalline: true,
    },
    {
      route: "/nonteam_validation",
      //  icon: <GiDarkSquad />,
      label: "Non-Team Validation",
      showverticalline: true,
    },
    // {
    //   route: "/team_request",
    //   // icon: <MdOutlineThumbUpAlt />,
    //   label: "Request",
    //   notification: count > 0 ? count : "",
    //   showverticalline: true,
    // },
    // {
    //   route: "/baco",
    //   // icon: <GiTeacher />,
    //   label: "Baco",
    //   showverticalline: true,
    // },
    // {
    //   route: "/leaders",
    //   // icon: <GiTeacher />,
    //   label: "Leaders",
    //   showverticalline: true,
    // },
    {
      route: "/services",
      // icon: <LiaHandsHelpingSolid />,
      label: "Services",
      showverticalline: true,
    },
    {
      route: "/users",
      // icon: <RiUserSettingsLine />,
      label: "Users",
      showverticalline: true,
    },
    {
      route: "/settings",
      // icon: <TbSettingsCheck />,
      label: "Settings",
      showverticalline: true,
    },
  ];

  const sidebarLinks_voters_monitoring = [
    {
      route: "/voters_monitoring",
      // icon: <FaPersonChalkboard />,
      label: "Monitoring",
      showverticalline: true,
    },
    {
      route: "/voters_ato",
      // icon: <AiOutlineIdcard />,
      label: "ELECTORATE ID",
      showverticalline: true,
    },
    {
      route: "/goldaffiliate_id",
      // icon: <AiOutlineIdcard />,
      label: "GOLD AFFILIATE ID",
      showverticalline: true,
    },

    {
      route: "/scan_verify",
      // icon: <AiOutlineIdcard />,
      label: "Scan & Verify",
      showverticalline: true,
    },
  ];

  const sidebarLinks_events_monitoring = [
    {
      route: "/events",
      // icon: <FaPersonChalkboard />,
      label: "Event Manager",
      showverticalline: true,
    },
    {
      route: "/attendance",
      // icon: <AiOutlineIdcard />,
      label: "Attendance",
      showverticalline: true,
    },
    {
      route: "/event_attendees",
      // icon: <AiOutlineIdcard />,
      label: "Attendees",
      showverticalline: true,
    },
    {
      route: "/event_settings",
      // icon: <AiOutlineIdcard />,
      label: "Settings",
      showverticalline: true,
    },
  ];

  const sidebarLinks_report = [
    {
      route: "/rpt_servicesbeneficiary",
      icon: <GiReceiveMoney />,
      label: "Services Beneficiary",
      showverticalline: true,
    },
    {
      route: "/rpt_survey",
      icon: <LiaUserTagSolid />,
      label: "Electorate Survey",
      showverticalline: true,
    },
    {
      route: "/rpt_electorate_classification",
      icon: <LiaUserTagSolid />,
      label: "Team Validation",
      showverticalline: true,
    },
    {
      route: "/rpt_nonteam_classification",
      icon: <LiaUserTagSolid />,
      label: "Non-Team Validation",
      showverticalline: true,
    },
    {
      route: "/rpt_electorate_LP_LM_LDC_W",
      icon: <LiaUserTagSolid />,
      label: "Gold Affiliates",
      showverticalline: true,
    },
    {
      route: "/rpt_leader_list",
      icon: <LiaUserTagSolid />,
      label: "Leaders",
      showverticalline: true,
    },

    {
      route: "/rpt_team_list",
      icon: <LiaUserTagSolid />,
      label: "Team",
      showverticalline: true,
    },
    // {
    //   route: "/rpt_leader_hierarchy",
    //   icon: <LiaUserTagSolid />,
    //   label: "Leaders Hierarchy",
    //   showverticalline: true,
    // },
    {
      route: "/rpt_ulogs",
      icon: <PiUserListLight />,
      label: "User Logs",
      showverticalline: true,
    },
    {
      route: "/rpt_event_attendees",
      icon: <PiUserListLight />,
      label: "Event Attendees",
      showverticalline: true,
    },
  ];

  const sidebarLinks_forms = [
    {
      route: "/forms_survey",
      icon: <RiSurveyLine />,
      label: "Survey Form",
      showverticalline: true,
    },
  ];

  return (
    <nav>
      <NavList>
        {sidebarLinks_dashboard.map(
          ({ route, icon, label, showverticalline }) =>
            permissions.includes(route.replace("/", "")) && (
              <li key={route}>
                <StyledNavLink
                  onClick={() => toggleCollapse("")}
                  to={route}
                  showverticalline={showverticalline ? "true" : undefined}
                >
                  {icon}
                  <span>{label}</span>
                </StyledNavLink>
              </li>
            )
        )}
      </NavList>

      {sidebarLinks_operation.some(({ route }) =>
        permissions.includes(route.replace("/", ""))
      ) && (
        <>
          <NavList>
            <StyledNavLinkCollapsable
              onClick={() => toggleCollapse("operations")}
              isactives={activeCollapse === "operations" ? "true" : undefined}
            >
              <LabelWithIconContainer>
                <PiCirclesThreePlusBold />
                <span>OPERATION</span>
              </LabelWithIconContainer>
              {activeCollapse === "operations" ? (
                <IoIosArrowDown />
              ) : (
                <MdOutlineKeyboardArrowRight />
              )}
            </StyledNavLinkCollapsable>
          </NavList>
          {activeCollapse === "operations" && (
            <NavList>
              {sidebarLinks_operation.map(
                ({ route, icon, label, notification, showverticalline }) =>
                  permissions.includes(route.replace("/", "")) && (
                    <li key={route}>
                      <StyledNavLink
                        to={route}
                        showverticalline={showverticalline ? "true" : undefined}
                      >
                        {/* {icon} */}
                        <span className="ml-14">{label}</span>
                        {notification && (
                          <div className="ml-2">
                            <span className="text-base text-red-500 font-bold">
                              {notification}
                            </span>
                            <NotificationIcon />
                          </div>
                        )}
                      </StyledNavLink>
                    </li>
                  )
              )}
            </NavList>
          )}
        </>
      )}

      {sidebarLinks_voters_monitoring.some(({ route }) =>
        permissions.includes(route.replace("/", ""))
      ) && (
        <>
          <NavList>
            <StyledNavLinkCollapsable
              onClick={() => toggleCollapse("votersMonitoring")}
              isactives={
                activeCollapse === "votersMonitoring" ? "true" : undefined
              }
            >
              <LabelWithIconContainer>
                <FaPersonChalkboard />
                <span>VOTERS</span>
              </LabelWithIconContainer>
              {activeCollapse === "votersMonitoring" ? (
                <IoIosArrowDown />
              ) : (
                <MdOutlineKeyboardArrowRight />
              )}
            </StyledNavLinkCollapsable>
          </NavList>

          {activeCollapse === "votersMonitoring" && (
            <NavList>
              {sidebarLinks_voters_monitoring.map(
                ({ route, icon, label, showverticalline }) =>
                  permissions.includes(route.replace("/", "")) && (
                    <li key={route}>
                      <StyledNavLink
                        to={route}
                        showverticalline={showverticalline ? "true" : undefined}
                      >
                        {/* {icon} */}
                        <span className="ml-14">{label}</span>
                      </StyledNavLink>
                    </li>
                  )
              )}
            </NavList>
          )}
        </>
      )}

      {sidebarLinks_events_monitoring.some(({ route }) =>
        permissions.includes(route.replace("/", ""))
      ) && (
        <>
          <NavList>
            <StyledNavLinkCollapsable
              onClick={() => toggleCollapse("events")}
              isactives={activeCollapse === "events" ? "true" : undefined}
            >
              <LabelWithIconContainer>
                <MdOutlineEvent />
                <span>EVENTS</span>
              </LabelWithIconContainer>
              {activeCollapse === "events" ? (
                <IoIosArrowDown />
              ) : (
                <MdOutlineKeyboardArrowRight />
              )}
            </StyledNavLinkCollapsable>
          </NavList>

          {activeCollapse === "events" && (
            <NavList>
              {sidebarLinks_events_monitoring.map(
                ({ route, icon, label, showverticalline }) =>
                  permissions.includes(route.replace("/", "")) && (
                    <li key={route}>
                      <StyledNavLink
                        to={route}
                        showverticalline={showverticalline ? "true" : undefined}
                      >
                        {/* {icon} */}
                        <span className="ml-14">{label}</span>
                      </StyledNavLink>
                    </li>
                  )
              )}
            </NavList>
          )}
        </>
      )}

      {sidebarLinks_report.some(({ route }) =>
        permissions.includes(route.replace("/", ""))
      ) && (
        <>
          <NavList>
            <StyledNavLinkCollapsable
              onClick={() => toggleCollapse("reports")}
              isactives={activeCollapse === "reports" ? "true" : undefined}
            >
              <LabelWithIconContainer>
                <TbFileReport />
                <span>REPORTS</span>
              </LabelWithIconContainer>
              {activeCollapse === "reports" ? (
                <IoIosArrowDown />
              ) : (
                <MdOutlineKeyboardArrowRight />
              )}
            </StyledNavLinkCollapsable>
          </NavList>

          {activeCollapse === "reports" && (
            <NavList>
              {sidebarLinks_report.map(
                ({ route, icon, label, showverticalline }) =>
                  permissions.includes(route.replace("/", "")) && (
                    <li key={route}>
                      <StyledNavLink
                        to={route}
                        showverticalline={showverticalline ? "true" : undefined}
                      >
                        <span className="ml-14">{label}</span>
                      </StyledNavLink>
                    </li>
                  )
              )}
            </NavList>
          )}
        </>
      )}

      {sidebarLinks_forms.some(({ route }) =>
        permissions.includes(route.replace("/", ""))
      ) && (
        <>
          <NavList>
            <StyledNavLinkCollapsable
              onClick={() => toggleCollapse("forms")}
              isactives={activeCollapse === "forms" ? "true" : undefined}
            >
              <LabelWithIconContainer>
                <RiSurveyLine />
                <span>FORMS</span>
              </LabelWithIconContainer>
              {activeCollapse === "forms" ? (
                <IoIosArrowDown />
              ) : (
                <MdOutlineKeyboardArrowRight />
              )}
            </StyledNavLinkCollapsable>
          </NavList>

          {activeCollapse === "forms" && (
            <NavList>
              {sidebarLinks_forms.map(
                ({ route, icon, label, showverticalline }) =>
                  permissions.includes(route.replace("/", "")) && (
                    <li key={route}>
                      <StyledNavLink
                        to={route}
                        showverticalline={showverticalline ? "true" : undefined}
                      >
                        <span className="ml-14">{label}</span>
                      </StyledNavLink>
                    </li>
                  )
              )}
            </NavList>
          )}
        </>
      )}
    </nav>
  );
}

export default MainNav;
