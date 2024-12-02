import { format } from "date-fns";
import Table from "../../../ui/Table";
import { replaceSpecialChars } from "../../../utils/helpers";
function ScannedTableRow({ electorate, index, scannedvoters }) {
  const {
    id,
    scanned_type,
    created_at,
    brgy,
    team,
    electorates,
    scanned_remarks,
  } = electorate;

  let electorates_type;
  if (electorates) {
    if (electorates.isleader === true && electorates.precinctleader !== null) {
      electorates_type = "TOWER";
    } else if (
      electorates.isleader === null &&
      electorates.precinctleader !== null
    ) {
      electorates_type = "WARRIORS";
    } else if (electorates.is_baco === true) {
      electorates_type = "BACO";
    } else if (electorates.is_gm === true) {
      electorates_type = "GM";
    } else if (electorates.is_agm === true) {
      electorates_type = "AGM";
    } else if (electorates.is_legend === true) {
      electorates_type = "LEGEND";
    } else if (electorates.is_elite === true) {
      electorates_type = "ELITE";
    }
  }

  return (
    <Table.Row>
      <div>{index + 1}</div>
      <div>
        <span>{format(new Date(created_at), "MMM dd yyyy  hh:mm:ss a")}</span>
      </div>
      <div>{scanned_type}</div>
      <div>{replaceSpecialChars(electorates?.precinctno)}</div>
      <div>
        {replaceSpecialChars(electorates?.lastname)},{" "}
        {replaceSpecialChars(electorates?.firstname)}{" "}
        {replaceSpecialChars(electorates?.middlename)}
      </div>
      <div>{electorates_type}</div>
      {/* <div>{replaceSpecialChars(electorates?.purok)}</div> */}
      <div>{brgy}</div>
      <div>
        {team?.firstname} {team?.lastname}
      </div>
      <div>
        {scanned_remarks !== "SWING VOTER" ? "ALLIED VOTERS" : "SWING VOTER"}
      </div>
    </Table.Row>
  );
}

export default ScannedTableRow;
