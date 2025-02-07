import Stat from "./Stat";
import { FaPersonChalkboard } from "react-icons/fa6";
import { TbUserCancel, TbUserQuestion } from "react-icons/tb";
import { LiaUserTagSolid } from "react-icons/lia";
import { SlQuestion, SlUserFollowing } from "react-icons/sl";
// import { FaUserTie } from "react-icons/fa6";
// import { FaBuildingUser } from "react-icons/fa6";
import { PiAirplaneTakeoffBold } from "react-icons/pi";
import { BsBuildings } from "react-icons/bs";
// import { HiOutlineBuildingLibrary } from "react-icons/hi2";
import { GiChurch } from "react-icons/gi";
import { FiUsers } from "react-icons/fi";
import { FaUserXmark } from "react-icons/fa6";
import { FaUserSecret } from "react-icons/fa6";
import { PiCoinsLight } from "react-icons/pi";
import { useNavigate, useSearchParams } from "react-router-dom";
function Stats({
  tot_Electorates,
  tot_Validated,
  tot_Dili,
  tot_Ato,
  total_OT,
  total_INC,
  total_JEHOVAH,
  tot_deceased,
  tot_nvs,
  tot_undecided,
  tot_lubas,
}) {
  const [searchParams] = useSearchParams();
  const validationType = searchParams.get("validation") || "Survey";

  const navigate = useNavigate();

  const handleClickAffiliates = () => {
    navigate("/rpt_electorate_LP_LM_LDC_W"); // Replace '/target-page' with your desired route
  };
  const handleElectorates = () => {
    navigate("/electorate"); // Replace '/target-page' with your desired route
  };
  const handleElecValidated = () => {
    if (validationType === "1v") {
      navigate("/rpt_electorate_classification?validation=1v&assigned=all"); // Replace '/target-page' with your desired route
    } else if (validationType === "2v") {
      navigate("/rpt_electorate_classification?validation=2v&assigned=all"); // Replace '/target-page' with your desired route
    } else if (validationType === "3v") {
      navigate("/rpt_electorate_classification?validation=3v&assigned=all"); // Replace '/target-page' with your desired route
    } else if (validationType === "Survey") {
      navigate("/rpt_survey?result=ALL"); // Replace '/target-page' with your desired route
    }
  };
  const handleSurveyAto = () => {
    if (validationType === "1v") {
      navigate("/rpt_electorate_classification?validation=1v&assigned=1"); // Replace '/target-page' with your desired route
    } else if (validationType === "2v") {
      navigate("/rpt_electorate_classification?validation=2v&assigned=1"); // Replace '/target-page' with your desired route
    } else if (validationType === "3v") {
      navigate("/rpt_electorate_classification?validation=3v&assigned=1"); // Replace '/target-page' with your desired route
    } else if (validationType === "Survey") {
      navigate("/rpt_survey?result=ATO"); // Replace '/target-page' with your desired route
    }
  };
  const handleSurveyDili = () => {
    if (validationType === "1v") {
      navigate("/rpt_nonteam_classification?validation=1v&result=DILI"); // Replace '/target-page' with your desired route
    } else if (validationType === "2v") {
      navigate("/rpt_nonteam_classification?validation=2v&result=DILI"); // Replace '/target-page' with your desired route
    } else if (validationType === "3v") {
      navigate("/rpt_nonteam_classification?validation=3v&result=DILI"); // Replace '/target-page' with your desired route
    } else if (validationType === "Survey") {
      navigate("/rpt_survey?result=DILI"); // Replace '/target-page' with your desired route
    }
  };
  const handleSurveyUndecided = () => {
    if (validationType === "1v") {
      navigate("/rpt_nonteam_classification?validation=1v&result=UNDECIDED"); // Replace '/target-page' with your desired route
    } else if (validationType === "2v") {
      navigate("/rpt_nonteam_classification?validation=2v&result=UNDECIDED"); // Replace '/target-page' with your desired route
    } else if (validationType === "3v") {
      navigate("/rpt_nonteam_classification?validation=3v&result=UNDECIDED"); // Replace '/target-page' with your desired route
    } else if (validationType === "Survey") {
      navigate("/rpt_survey?result=UNDECIDED"); // Replace '/target-page' with your desired route
    }
  };
  const handleSurveyDeceased = () => {
    if (validationType === "1v") {
      navigate("/rpt_nonteam_classification?validation=1v&result=DECEASED"); // Replace '/target-page' with your desired route
    } else if (validationType === "2v") {
      navigate("/rpt_nonteam_classification?validation=2v&result=DECEASED"); // Replace '/target-page' with your desired route
    } else if (validationType === "3v") {
      navigate("/rpt_nonteam_classification?validation=3v&result=DECEASED"); // Replace '/target-page' with your desired route
    } else if (validationType === "Survey") {
      navigate("/rpt_survey?result=DECEASED"); // Replace '/target-page' with your desired route
    }
  };
  const handleSurveyNVS = () => {
    if (validationType === "1v") {
      navigate("/rpt_nonteam_classification?validation=1v&result=NVS"); // Replace '/target-page' with your desired route
    } else if (validationType === "2v") {
      navigate("/rpt_nonteam_classification?validation=2v&result=NVS"); // Replace '/target-page' with your desired route
    } else if (validationType === "3v") {
      navigate("/rpt_nonteam_classification?validation=3v&result=NVS"); // Replace '/target-page' with your desired route
    } else if (validationType === "Survey") {
      navigate("/rpt_survey?result=NVS"); // Replace '/target-page' with your desired route
    }
  };
  const handleSurveyOT = () => {
    if (validationType === "1v") {
      navigate("/rpt_electorate_classification?validation=1v&assigned=4"); // Replace '/target-page' with your desired route
    } else if (validationType === "2v") {
      navigate("/rpt_electorate_classification?validation=2v&assigned=4"); // Replace '/target-page' with your desired route
    } else if (validationType === "3v") {
      navigate("/rpt_electorate_classification?validation=3v&assigned=4"); // Replace '/target-page' with your desired route
    } else if (validationType === "Survey") {
      navigate("/rpt_survey?result=OUT OF TOWN"); // Replace '/target-page' with your desired route
    }
  };
  const handleSurveyInc = () => {
    if (validationType === "1v") {
      navigate("/rpt_nonteam_classification?validation=1v&result=INC"); // Replace '/target-page' with your desired route
    } else if (validationType === "2v") {
      navigate("/rpt_nonteam_classification?validation=2v&result=INC"); // Replace '/target-page' with your desired route
    } else if (validationType === "3v") {
      navigate("/rpt_nonteam_classification?validation=3v&result=INC"); // Replace '/target-page' with your desired route
    } else if (validationType === "Survey") {
      navigate("/rpt_survey?result=INC"); // Replace '/target-page' with your desired route
    }
  };
  const handleSurveyJehovah = () => {
    if (validationType === "1v") {
      navigate("/rpt_nonteam_classification?validation=1v&result=JEHOVAH"); // Replace '/target-page' with your desired route
    } else if (validationType === "2v") {
      navigate("/rpt_nonteam_classification?validation=2v&result=JEHOVAH"); // Replace '/target-page' with your desired route
    } else if (validationType === "3v") {
      navigate("/rpt_nonteam_classification?validation=3v&result=JEHOVAH"); // Replace '/target-page' with your desired route
    } else if (validationType === "Survey") {
      navigate("/rpt_survey?result=JEHOVAH"); // Replace '/target-page' with your
    }

    //  desired route
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
      <div onClick={handleElecValidated}>
        <Stat
          title="Total Validated"
          color="violet"
          icon={<LiaUserTagSolid />}
          value={
            tot_Ato +
            total_OT +
            tot_Dili +
            tot_undecided +
            tot_deceased +
            tot_nvs +
            total_INC +
            total_JEHOVAH +
            tot_lubas
          }
          // value={validationType === "Survey" ? tot_Validated : 0}
          // + tot_Ato_groundManagement + tot_Ato + total_OT
        />{" "}
      </div>
      <Stat
        title="Total Unvalidated"
        color="grey"
        icon={<TbUserQuestion />}
        value={
          tot_Electorates -
          (tot_Ato +
            total_OT +
            tot_Dili +
            tot_undecided +
            tot_deceased +
            tot_nvs +
            total_INC +
            total_JEHOVAH +
            tot_lubas)
        }
      />

      <div className="grid grid-cols-subgrid gap-4 col-span-4">
        <div className="col-start-1" onClick={handleSurveyAto}>
          <Stat
            // title="Total Ato"
            title=""
            color="green"
            icon={<SlUserFollowing />}
            value={tot_Ato}
          />
        </div>
        <div className="col-start-2" onClick={handleSurveyDili}>
          <Stat
            // title="Total Dili"
            title=""
            color="red"
            icon={<FaUserXmark />}
            value={tot_Dili}
          />
        </div>
        <div className="col-start-3" onClick={handleSurveyUndecided}>
          <Stat
            // title="Total Undecided"
            color="yellow"
            icon={<SlQuestion />}
            value={tot_undecided}
          />
        </div>
        <div className="col-start-1" onClick={handleSurveyDeceased}>
          <Stat
            // title="Total Deceased"
            color="black"
            icon={<TbUserCancel />}
            value={tot_deceased}
          />
        </div>
        <div className="col-start-2" onClick={handleSurveyNVS}>
          <Stat
            // title="NVS- (SPECIAL OPERATION)"
            color="orange"
            icon={<FaUserSecret />}
            value={tot_nvs}
          />
        </div>
        <div className="col-start-3" onClick={handleSurveyOT}>
          <Stat
            // title="TOTAL OUT OF TOWN"
            color="pink"
            icon={<PiAirplaneTakeoffBold />}
            value={total_OT}
          />
        </div>
        <div className="col-start-1" onClick={handleSurveyInc}>
          <Stat
            // title="TOTAL INC"
            color="mintgreen"
            icon={<GiChurch />}
            value={total_INC}
          />
        </div>
        <div className="col-start-2" onClick={handleSurveyJehovah}>
          <Stat
            title="TOTAL JEHOVAH"
            color="grey"
            icon={<BsBuildings />}
            value={total_JEHOVAH}
          />
        </div>

        <div
          className="col-start-3"
          onClick={handleClickAffiliates}
          style={{ cursor: "pointer" }}
        >
          <Stat
            // title="TOTAL LUBAS"
            color="gold"
            icon={<PiCoinsLight />}
            value={tot_lubas}
          />
        </div>
      </div>
    </>
  );
}

export default Stats;
