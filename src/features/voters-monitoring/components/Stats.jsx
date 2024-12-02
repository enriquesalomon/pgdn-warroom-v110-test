import Stat from "./Stat";
import { FaPersonChalkboard } from "react-icons/fa6";
import { BiQrScan, BiScan } from "react-icons/bi";

function Stats({ tot_Ato, tot_Scanned }) {
  let tot_Unscanned = tot_Ato - tot_Scanned;
  //could to not display negative value in the Unscanned---
  tot_Unscanned = Math.max(tot_Unscanned, 0);
  // --------
  return (
    <>
      <Stat
        title="Total Voters(Ato)"
        color="orange"
        icon={<FaPersonChalkboard />}
        value={tot_Ato}
      />
      <Stat
        title="Total Scanned"
        color="green"
        icon={<BiQrScan />}
        value={tot_Scanned}
      />
      <Stat
        title="Total Unscanned ATO"
        color="grey"
        icon={<BiScan />}
        value={tot_Unscanned}
      />
    </>
  );
}

export default Stats;
