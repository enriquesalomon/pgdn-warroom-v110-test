import Spinner from "../../../ui/Spinner";
import Stats from "./Stats";
import PerBarangayChart from "./PerBarangayChart";
import ElectoratePieChart from "./ElectoratePieChart";

import {
  useTotalElectorates,
  useTotalValidated,
  useTotalAto,
  useTotalDili,
  useTotalPerBrgy,
  useTotalOT,
  useTotalINC,
  useTotalJEHOVAH,
  useTotalPerBrgy_Unvalidated,
  useTotal_AtoGroundLeaders,
  useTotal_Count_Summaru_PerBrgy,
  useTotalUnValidated,
  useTotalPerBrgy_BarChart,
  useTotalDeceased,
  useTotalNVS,
  useTotalUndecided,
  useTotalLubas,
} from "../../dashboard/hooks/useElectorates";
import ElectoratePieChartExcludeUV from "./ElectoratePieChartExcludeUV";
import { deceased } from "./../../../utils/constants";
import Modal from "../../../ui/Modal";
import { Button } from "../../../ui/Menus";
import { HiPlus } from "react-icons/hi2";
import CreateBeneficiaryForm from "../../services/components/CreateBeneficiaryForm";
import { useSearchParams } from "react-router-dom";
function DashboardLayout() {
  const [searchParams] = useSearchParams();
  let validationType = searchParams.get("validation");
  const { isPending: isPending1, data: total_electorates } =
    useTotalElectorates();
  const { isPending: isPending2, data: total_Validated } = useTotalValidated();

  const { isPending: isPending4, data: total_Ato } = useTotalAto();
  const { isPending: isPending3, data: total_Dili } = useTotalDili();
  // const { isPending: isPending5, data: total_Unvalidated_Dili } =
  //   useTotalDili();
  const { isPending: isPending5, data: total_Unvalidated } =
    useTotalUnValidated();
  const { isPending: isPending9, data: total_OT } = useTotalOT();
  const { isPending: isPending10, data: total_INC } = useTotalINC();
  const { isPending: isPending11, data: total_JEHOVAH } = useTotalJEHOVAH();
  const { isPending: isPending15, data: total_deceased } = useTotalDeceased();
  const { isPending: isPending16, data: total_nvs } = useTotalNVS();
  const { isPending: isPending17, data: total_undecided } = useTotalUndecided();
  const { isPending: isPending18, data: total_lubas } = useTotalLubas();
  console.log("11---------------", total_deceased);
  console.log("22---------------", total_Ato);
  console.log("33---------------", total_deceased);
  console.log("44---------------", total_nvs);
  const { isPending: isPending7, data: dataPerbrgy } =
    useTotalPerBrgy_BarChart();

  const { isPending: isPending12, data: dataPerbrgy_unvalidated } =
    useTotalPerBrgy_Unvalidated();

  const { isPending: isPending14, data: total_count_summary_per_brgy } =
    useTotal_Count_Summaru_PerBrgy();

  console.log(
    "count total_count_summary_per_brgy",
    JSON.stringify(total_count_summary_per_brgy)
  );

  if (
    isPending1 ||
    isPending2 ||
    // isPending3 ||
    isPending5 ||
    // isPending6 ||
    isPending7 ||
    // isPending8
    isPending9 ||
    isPending10 ||
    isPending11 ||
    isPending12 ||
    isPending14 ||
    isPending15 ||
    isPending16 ||
    isPending17 ||
    isPending18
  )
    return <Spinner />;
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <Stats
          tot_Electorates={total_electorates.count}
          tot_Validated={total_Validated?.count}
          tot_Ato={total_Ato.count}
          tot_Dili={total_Dili?.count}
          total_OT={total_OT.count}
          total_INC={total_INC.count}
          total_JEHOVAH={total_JEHOVAH.count}
          tot_deceased={total_deceased.count}
          tot_nvs={total_nvs.count}
          tot_undecided={total_undecided.count}
          tot_lubas={total_lubas.count}
        />

        {/* <div className="col-span-2 ...">
          <ElectoratePieChart
            tot_Validated={total_Validated?.count}
            tot_Electorates={total_electorates.count}
            dili={total_Dili?.count}
            Ato={total_Ato.count}
            Unvalidated={total_Unvalidated.count}
            tot_Ato_groundManagement={total_groundManagement.count}
            OT={total_OT.count}
            INC={total_INC.count}
            JEHOVAH={total_JEHOVAH.count}
            undecided={total_undecided.count}
            deceased={total_deceased.count}
            nvs={total_nvs.count}
          />
        </div> */}
        <div className="col-span-3">
          <ElectoratePieChartExcludeUV
            Ato={total_Ato.count}
            dili={total_Dili.count}
            OT={total_OT.count}
            INC={total_INC.count}
            JEHOVAH={total_JEHOVAH.count}
            undecided={total_undecided.count}
            deceased={total_deceased.count}
            nvs={total_nvs.count}
            lubas={total_lubas.count}
          />
        </div>

        {/* <PerBarangayChart data_brgy={dataPerbrgy} /> */}
        {/* {validationType !== "Survey" && ( */}
        <PerBarangayChart
          total_count_summary_per_brgy={total_count_summary_per_brgy}
          // data_brgy={dataPerbrgy}
          dataPerbrgy_unvalidated={dataPerbrgy_unvalidated}
        />
        {/* )} */}
      </div>
    </>
  );
}

export default DashboardLayout;
