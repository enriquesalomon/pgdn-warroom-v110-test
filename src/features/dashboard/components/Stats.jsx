import Stat from "./Stat";
import { FaPersonChalkboard } from "react-icons/fa6";
import { TbUserQuestion } from "react-icons/tb";
import { LiaUserTagSolid } from "react-icons/lia";
import { SlUserFollowing } from "react-icons/sl";
// import { FaUserTie } from "react-icons/fa6";
// import { FaBuildingUser } from "react-icons/fa6";
import { PiAirplaneTakeoffBold } from "react-icons/pi";
import { BsBuildings } from "react-icons/bs";
// import { HiOutlineBuildingLibrary } from "react-icons/hi2";
import { GiChurch } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

function Stats({
  tot_Electorates,
  tot_Validated,
  tot_Ato,
  total_OT,
  total_INC,
  total_JEHOVAH,
  tot_Ato_groundManagement,
}) {
  const navigate = useNavigate();
  const handleElectorates = () => {
    navigate("/electorate"); // Replace '/target-page' with your desired route
  };

  const handleElectoratesAto = () => {
    navigate("/rpt_electorate_classification?assigned=1"); // Replace '/target-page' with your desired route
  };
  const handleElectoratesDiliUnval = () => {
    navigate("/rpt_electorate_classification?assigned=0"); // Replace '/target-page' with your desired route
  };
  const handleElectoratesOT = () => {
    navigate("/rpt_electorate_classification?assigned=4"); // Replace '/target-page' with your desired route
  };
  const handleElectoratesINC = () => {
    navigate("/rpt_electorate_classification?assigned=5"); // Replace '/target-page' with your desired route
  };
  const handleElectoratesJH = () => {
    navigate("/rpt_electorate_classification?assigned=6"); // Replace '/target-page' with your desired route
  };
  return (
    <>
      <div onClick={handleElectorates}>
        <Stat
          title="Total Electorates"
          color="blue"
          icon={<FaPersonChalkboard />}
          value={tot_Electorates}
        />
      </div>

      <Stat
        title="Total Validated"
        color="green"
        icon={<LiaUserTagSolid />}
        value={tot_Validated + tot_Ato_groundManagement}
      />
      <div onClick={handleElectoratesDiliUnval}>
        <Stat
          title="Total Unvalidated / DILI"
          color="grey"
          icon={<TbUserQuestion />}
          value={tot_Electorates - (tot_Validated + tot_Ato_groundManagement)}
        />
      </div>

      <div className="grid grid-cols-subgrid gap-4 col-span-4">
        <div className="col-start-1" onClick={handleElectoratesAto}>
          <Stat
            title="Total Ato"
            color="orange"
            icon={<SlUserFollowing />}
            value={tot_Ato + tot_Ato_groundManagement}
          />
        </div>
        {/* <div className="col-start-2">
          <Stat
            title="Total Dili"
            color="red"
            icon={<SlUserUnfollow />}
            value={tot_Dili}
          />
        </div> */}
        {/* <div className="col-start-3">
          <Stat
            title="Total Undecided"
            color="grey"
            icon={<SlQuestion />}
            value={tot_Undecided}
          />
        </div> */}
        {/* <div className="col-start-1">
          <Stat
            title="Total Deceased"
            color="grey"
            icon={<TbUserCancel />}
            value={tot_Deceased}
          />
        </div> */}
        <div className="col-start-2" onClick={handleElectoratesOT}>
          <Stat
            title="TOTAL OUT OF TOWN"
            color="blue"
            icon={<PiAirplaneTakeoffBold />}
            value={total_OT}
          />
        </div>
        <div className="col-start-3" onClick={handleElectoratesINC}>
          <Stat
            title="TOTAL INC"
            color="grey"
            icon={<GiChurch />}
            value={total_INC}
          />
        </div>
        <div className="col-start-1" onClick={handleElectoratesJH}>
          <Stat
            title="TOTAL JEHOVAH"
            color="grey"
            icon={<BsBuildings />}
            value={total_JEHOVAH}
          />
        </div>
      </div>
    </>
  );
}

export default Stats;
