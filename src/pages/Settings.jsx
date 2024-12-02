import SettingsPage from "../features/settings/components/SettingsPage";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UnAuthorized from "../ui/UnAuthorized";
import { usePagePermissionContext } from "../context/PagePermissionContext";
import { parsePage } from "../utils/helpers";

function Settings() {
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "settings");
  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <Row>
      <Heading as="h2">SETTINGS</Heading>
      <SettingsPage />
    </Row>
  );
}

export default Settings;
