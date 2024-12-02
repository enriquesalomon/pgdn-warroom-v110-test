import { format } from "date-fns";
import Table from "../../../../ui/Table";
import Tag from "../../../../ui/Tag";
function LogsRow({ log, index }) {
  //   {
  //   "id": 728,
  //   "created_at": "2024-07-03T03:14:45.484827+00:00",
  //   "page": "Services",
  //   "action": "User delete a service record availment",
  //   "parameters": null,
  //   "user_id": "f3ac6c33-2967-41f4-b214-40ca28b5aace",
  //   "users": {
  //     "email": "superadmin@gmail.com",
  //     "account_role": "Super Admin"
  //   }
  // }
  const { created_at, page, action, parameters, user_id, users } = log;
  return (
    <Table.Row>
      {/* <div>{index + 1}</div> */}
      <div>
        <span>{format(new Date(created_at), "MMM dd yyyy  hh:mm:ss a")}</span>
      </div>
      <div>{users?.email}</div>
      <div>{users?.account_role}</div>
      <div>{page}</div>
      <div>{action}</div>
    </Table.Row>
  );
}

export default LogsRow;
