import {
  BrowserRouter,
  HashRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

import GlobalStyles from "./styles/GlobalStyles";
import Dashboard from "./pages/Dashboard";
import Kamada from "./pages/Kamada";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./ui/AppLayout";
import ProtectedRoute from "./ui/ProtectedRoute";
import { DarkModeProvider } from "./context/DarkModeContext";
import Electorate from "./pages/Electorate";
import "./index.css";
import Teams from "./pages/Teams";
import RptServicesBeneficiaryPage from "./pages/RptServicesBeneficiary";
import RptUserLogs from "./pages/RptUserLogs";
import Services from "./pages/Services";
import Voters from "./pages/Voters";
import VotersGold from "./pages/VotersGold";
import VotersMonitoring from "./pages/VotersMonitoring";
import ScanVerify from "./pages/ScanVerify";
import RptElectorateClassification from "./pages/RptElectorateClassification";
import ElectorateClassification from "./pages/ElectorateClassification";
import ElectorateSurvey from "./pages/ElectorateSurvey";
import RptTeamList from "./pages/RptTeamList";
import TeamValidation from "./pages/TeamValidation";
import Gmap from "./pages/Gmap";
import RptSurveyForms from "./pages/RptSurveyForms";
import Events from "./pages/Events";
import EventAttendees from "./pages/EventAttendees";
import RptEventAttendees from "./pages/RptEventAttendees";
import RptElectorateLPLMLDCW from "./pages/RptElectorateLPLMLDCW";
import RptSurvey from "./pages/RptSurvey";
import RptLeaders from "./pages/RptLeaders";
import NonTeamValidation from "./pages/NonTeamValidation";
import RptNonTeamClassification from "./pages/RptNonTeamClassification";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 60 * 1000, //1 min
      // staleTime: 10 * (60 * 1000), //10 mins
      staleTime: 0,
    },
  },
});

function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
        {import.meta.env.VITE_MODE === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}

        <GlobalStyles />
        <BrowserRouter>
          {/* <HashRouter> */}
          {/* --> USE THIS INSTEAD BROWSERROUTER WHEN USING ELECTRON APP */}
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="kamada" element={<Kamada />} />
              <Route path="electorate" element={<Electorate />} />
              <Route path="users" element={<Users />} />
              <Route path="settings" element={<Settings />} />
              <Route path="account" element={<Account />} />
              <Route path="teams" element={<Teams />} />
              <Route path="team_validation" element={<TeamValidation />} />
              <Route
                path="nonteam_validation"
                element={<NonTeamValidation />}
              />

              <Route
                path="electorate_classification"
                element={
                  // <ElectorateClassification />
                  <ElectorateSurvey />
                }
              />
              <Route path="events" element={<Events />} />
              <Route path="event_attendees" element={<EventAttendees />} />
              <Route path="services" element={<Services />} />
              <Route path="voters_monitoring" element={<VotersMonitoring />} />
              <Route path="voters_ato" element={<Voters />} />
              <Route path="goldaffiliate_id" element={<VotersGold />} />
              <Route path="scan_verify" element={<ScanVerify />} />
              <Route
                path="rpt_servicesbeneficiary"
                element={<RptServicesBeneficiaryPage />}
              />
              <Route
                path="rpt_electorate_classification"
                element={<RptElectorateClassification />}
              />
              <Route
                path="rpt_nonteam_classification"
                element={<RptNonTeamClassification />}
              />
              <Route
                path="rpt_electorate_LP_LM_LDC_W"
                element={<RptElectorateLPLMLDCW />}
              />
              <Route path="rpt_leader_list" element={<RptLeaders />} />
              <Route path="rpt_survey" element={<RptSurvey />} />
              <Route path="rpt_team_list" element={<RptTeamList />} />
              <Route path="rpt_ulogs" element={<RptUserLogs />} />
              <Route path="forms_survey" element={<RptSurveyForms />} />
              <Route
                path="rpt_event_attendees"
                element={<RptEventAttendees />}
              />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
            <Route path="gmap" element={<Gmap />} />
          </Routes>
          {/* </HashRouter> */}
        </BrowserRouter>

        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "var(--color-grey-0)",
              color: "var(--color-grey-700)",
            },
          }}
        />
      </QueryClientProvider>
    </DarkModeProvider>
  );
}

export default App;
