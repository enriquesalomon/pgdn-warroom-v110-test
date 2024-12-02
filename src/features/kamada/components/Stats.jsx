import Stat from "./Stat";
import { FaPersonChalkboard } from "react-icons/fa6";
import { TbUserQuestion } from "react-icons/tb";
import { LiaUserTagSolid } from "react-icons/lia";
import { SlUserFollowing, SlUserUnfollow, SlQuestion } from "react-icons/sl";

function Stats({
  tot_Electorates,
  tot_Validated,
  tot_UnValidated,
  tot_Ato,
  tot_Dili,
  tot_Undecided,
}) {
  return (
    <>
      <Stat
        title="Total Electorates"
        color="blue"
        icon={<FaPersonChalkboard />}
        value={tot_Electorates}
      />
      <Stat
        title="Total Validated"
        color="green"
        icon={<LiaUserTagSolid />}
        value={tot_Validated}
      />
      <Stat
        title="Total Unvalidated"
        color="yellow"
        icon={<TbUserQuestion />}
        value={tot_UnValidated}
      />

      <div className="grid grid-cols-subgrid gap-4 col-span-4">
        <div className="col-start-1">
          <Stat
            title="Total Ato"
            color="orange"
            icon={<SlUserFollowing />}
            value={tot_Ato}
          />
        </div>
        <div className="col-start-2">
          <Stat
            title="Total Dili"
            color="red"
            icon={<SlUserUnfollow />}
            value={tot_Dili}
          />
        </div>
        <div className="col-start-3">
          <Stat
            title="Total Undecided"
            color="grey"
            icon={<SlQuestion />}
            value={tot_Undecided}
          />
        </div>
      </div>
    </>
  );
}

export default Stats;
