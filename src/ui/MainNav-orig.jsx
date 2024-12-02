// import React from "react";
// import styled, { keyframes } from "styled-components";
// import { NavLink } from "react-router-dom";
// import { LiaHandsHelpingSolid } from "react-icons/lia";
// import { RiUserSettingsLine, RiAccountPinBoxLine } from "react-icons/ri";
// import { GiTeacher } from "react-icons/gi";
// import { FaPersonChalkboard } from "react-icons/fa6";
// import { AiOutlineIdcard } from "react-icons/ai";
// import { IoAnalyticsSharp } from "react-icons/io5";
// import { IoMdAnalytics } from "react-icons/io";
// import { GiReceiveMoney } from "react-icons/gi";
// import { TbSettingsCheck } from "react-icons/tb";
// import { GiDarkSquad } from "react-icons/gi";
// import { usePagePermissionContext } from "../context/PagePermissionContext";
// import { PiUserListLight } from "react-icons/pi";
// import { LiaUserTagSolid } from "react-icons/lia";
// import { parsePagePermission } from "../utils/helpers";
// import { MdOutlineThumbUpAlt } from "react-icons/md";
// import { MdOutlineNotificationsActive } from "react-icons/md";
// import { useRequests } from "../features/request/hooks/useRequest";
// import { useDebounce } from "use-debounce";

// // Keyframes for shaking animation
// const shake = keyframes`
//   0% { transform: translateX(0); }
//   25% { transform: translateX(-2px); }
//   50% { transform: translateX(2px); }
//   75% { transform: translateX(-2px); }
//   100% { transform: translateX(0); }
// `;

// const NavList = styled.ul`
//   display: flex;
//   flex-direction: column;
//   gap: 0.8rem;
// `;

// const StyledNavLink = styled(NavLink)`
//   &:link,
//   &:visited {
//     display: flex;
//     align-items: center;
//     gap: 1.2rem;

//     color: var(--color-grey-600);
//     /* font-size: 1.6rem; */
//     font-size: 1.2rem;
//     font-weight: 500;
//     padding: 1.2rem 2.4rem;
//     transition: all 0.3s;
//   }

//   /* This works because react-router places the active class on the active NavLink */
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
// const NotificationIcon = styled(MdOutlineNotificationsActive)`
//   color: red !important;
//   width: 1.5rem;
//   height: 1.5rem;
//   margin-left: -1rem;
//   animation: ${shake} 0.5s infinite; //  shake animation
// `;
// // const NotificationCircle = styled.span`
// //   background-color: red;
// //   color: white;
// //   border-radius: 25%;
// //   width: 2.5rem;
// //   height: 2.5rem;
// //   display: flex;
// //   align-items: center;
// //   justify-content: center;
// //   font-size: 0.8rem;
// //   font-weight: bold;
// //   margin-left: -1rem;
// //   animation: ${shake} 0.5s infinite; // Apply the shake animation
// // `;
// const StyledNavLabel = styled(NavLink)`
//   color: var(--color-grey-400);
//   font-size: 1.2rem;
//   margin-left: 2.5rem;
// `;
// function MainNav() {
//   const [debouncedSearchTerm] = useDebounce("", 500); // Debounce search term

//   const { count } = useRequests(debouncedSearchTerm, "PENDING");

//   const { pagePermission } = usePagePermissionContext();
//   // let pagePermissionParse = null;
//   // try {
//   //   pagePermissionParse = JSON.parse(pagePermission);
//   // } catch (error) {
//   //   console.error("Error parsing JSON:", error);
//   // }

//   // let permissions = null;
//   // if (Array.isArray(pagePermissionParse)) {
//   //   permissions = pagePermission;
//   // } else {
//   //   permissions = decryptData(pagePermission);
//   // }
//   const permissions = parsePagePermission(pagePermission);
//   const sidebarLinks_dashboard = [
//     { route: "/dashboard", icon: <IoMdAnalytics />, label: "Dashboard" },
//     { route: "/kamada", icon: <IoAnalyticsSharp />, label: "Kamada" },
//   ];
//   const sidebarLinks_operation = [
//     {
//       route: "/electorate",
//       icon: <RiAccountPinBoxLine />,
//       label: "Electorates",
//     },
//     { route: "/teams", icon: <GiDarkSquad />, label: "Teams" },
//     {
//       route: "/team_request",
//       icon: <MdOutlineThumbUpAlt />,
//       label: "Request",
//       // notification: "",
//       notification: count > 0 ? count : "",
//     },
//     {
//       route: "/baco",
//       icon: <GiTeacher />,
//       label: "Baco",
//     },
//     { route: "/services", icon: <LiaHandsHelpingSolid />, label: "Services" },
//     { route: "/users", icon: <RiUserSettingsLine />, label: "Users" },
//     { route: "/settings", icon: <TbSettingsCheck />, label: "Settings" },
//   ];
//   const sidebarLinks_voters_monitoring = [
//     {
//       route: "/voters_monitoring",
//       icon: <FaPersonChalkboard />,
//       label: "Voters Monitoring",
//     },
//     {
//       route: "/voters_ato",
//       icon: <AiOutlineIdcard />,
//       label: "Organized Voters",
//     },
//   ];
//   const sidebarLinks_report = [
//     {
//       route: "/rpt_servicesbeneficiary",
//       icon: <GiReceiveMoney />,
//       label: "Services Beneficiary",
//     },
//     // {
//     //   route: "/rpt_electorate_validated",
//     //   icon: <LiaUserTagSolid />,
//     //   label: "Electorate Validated",
//     // },
//     {
//       route: "/rpt_electorate_classification",
//       icon: <LiaUserTagSolid />,
//       label: "Electorate Classification",
//     },
//     {
//       route: "/rpt_ulogs",
//       icon: <PiUserListLight />,
//       label: "User Logs",
//     },
//   ];
//   const hasOperations = sidebarLinks_operation.some(({ route }) =>
//     permissions.includes(route.replace("/", ""))
//   );
//   const hasVotersMonitoring = sidebarLinks_voters_monitoring.some(({ route }) =>
//     permissions.includes(route.replace("/", ""))
//   );
//   const hasReports = sidebarLinks_report.some(({ route }) =>
//     permissions.includes(route.replace("/", ""))
//   );
//   return (
//     <nav>
//       <NavList>
//         {sidebarLinks_dashboard.map(
//           ({ route, icon, label }) =>
//             permissions.includes(route.replace("/", "")) && (
//               <li key={route}>
//                 <StyledNavLink to={route}>
//                   {icon}
//                   <span>{label}</span>
//                 </StyledNavLink>
//               </li>
//             )
//         )}
//       </NavList>
//       {hasOperations && <StyledNavLabel>OPERATION</StyledNavLabel>}
//       <NavList>
//         {sidebarLinks_operation.map(
//           ({ route, icon, label, notification }) =>
//             permissions.includes(route.replace("/", "")) && (
//               <li key={route}>
//                 <StyledNavLink to={route}>
//                   {icon}
//                   <span>{label}</span>
//                   <div className="ml-2">
//                     {notification && (
//                       <>
//                         <span className="text-base text-red-500 font-bold">
//                           {notification}
//                         </span>
//                         <NotificationIcon />
//                       </>
//                     )}
//                   </div>
//                 </StyledNavLink>
//               </li>
//             )
//         )}
//       </NavList>
//       {hasVotersMonitoring && (
//         <StyledNavLabel>VOTERS MONITORING</StyledNavLabel>
//       )}
//       <NavList>
//         {sidebarLinks_voters_monitoring.map(
//           ({ route, icon, label }) =>
//             permissions.includes(route.replace("/", "")) && (
//               <li key={route}>
//                 <StyledNavLink to={route}>
//                   {icon}
//                   <span>{label}</span>
//                 </StyledNavLink>
//               </li>
//             )
//         )}
//       </NavList>
//       {hasReports && <StyledNavLabel>REPORTS</StyledNavLabel>}
//       <NavList>
//         {sidebarLinks_report.map(
//           ({ route, icon, label }) =>
//             permissions.includes(route.replace("/", "")) && (
//               <li key={route}>
//                 <StyledNavLink to={route}>
//                   {icon}
//                   <span>{label}</span>
//                 </StyledNavLink>
//               </li>
//             )
//         )}
//       </NavList>
//     </nav>
//   );
// }

// export default MainNav;
