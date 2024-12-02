import { usePagePermissionContext } from "../context/PagePermissionContext";
import UpdatePasswordForm from "../features/authentication/components/UpdatePasswordForm";
import UpdateUserDataForm from "../features/authentication/components/UpdateUserDataForm";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UnAuthorized from "../ui/UnAuthorized";
import { parsePage } from "../utils/helpers";

function Account() {
  const { pagePermission } = usePagePermissionContext();
  const isAllowed = parsePage(pagePermission, "account");

  if (!isAllowed) {
    // If isDashboardAllowed is false, return null or an alternative component/message
    return <UnAuthorized headerText="Page Not Found" />;
  }
  return (
    <>
      <Heading as="h1">Update your account</Heading>

      <Row>
        <Heading as="h3">Update user data</Heading>
        <UpdateUserDataForm />
      </Row>

      <Row>
        <Heading as="h3">Update password</Heading>
        <UpdatePasswordForm />
      </Row>
    </>
  );
}

export default Account;
