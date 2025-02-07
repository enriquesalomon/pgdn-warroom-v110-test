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
} from "../../dashboard/hooks/useElectorates";
import ElectoratePieChartExcludeUV from "./ElectoratePieChartExcludeUV";
function DashboardLayout() {
  const { isPending: isPending1, data: total_electorates } =
    useTotalElectorates();
  const { isPending: isPending2, data: total_Validated } = useTotalValidated();

  const { isPending: isPending4, data: total_Ato } = useTotalAto();
  const { isPending: isPending5, data: total_Unvalidated_Dili } =
    useTotalDili();
  const { isPending: isPending9, data: total_OT } = useTotalOT();
  const { isPending: isPending10, data: total_INC } = useTotalINC();
  const { isPending: isPending11, data: total_JEHOVAH } = useTotalJEHOVAH();
  const { isPending: isPending7, data: dataPerbrgy } = useTotalPerBrgy();
  const { isPending: isPending12, data: dataPerbrgy_unvalidated } =
    useTotalPerBrgy_Unvalidated();
  const { isPending: isPending13, data: total_groundManagement } =
    useTotal_AtoGroundLeaders();
  const { isPending: isPending14, data: total_count_summary_per_brgy } =
    useTotal_Count_Summaru_PerBrgy();
  console.log("----xxxx", JSON.stringify(total_count_summary_per_brgy));
  if (
    isPending1 ||
    isPending2 ||
    // isPending3 ||
    isPending13 ||
    isPending5 ||
    // isPending6 ||
    isPending7 ||
    // isPending8
    isPending9 ||
    isPending10 ||
    isPending11 ||
    isPending12 ||
    isPending14
  )
    return <Spinner />;
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <Stats
          tot_Electorates={total_electorates.count}
          tot_Validated={total_Validated.count}
          tot_Ato={total_Ato.count}
          tot_Ato_groundManagement={total_groundManagement.count}
          total_OT={total_OT.count}
          total_INC={total_INC.count}
          total_JEHOVAH={total_JEHOVAH.count}
        />
        <div className="col-span-2 ...">
          <ElectoratePieChart
            tot_Validated={total_Validated.count}
            tot_Electorates={total_electorates.count}
            Ato={total_Ato.count}
            Unvalidated_Dili={total_Unvalidated_Dili.count}
            tot_Ato_groundManagement={total_groundManagement.count}
            OT={total_OT.count}
            INC={total_INC.count}
            JEHOVAH={total_JEHOVAH.count}
          />
        </div>
        <div className="col-span-1 ...">
          <ElectoratePieChartExcludeUV
            tot_Ato_groundManagement={total_groundManagement.count}
            Ato={total_Ato.count}
            OT={total_OT.count}
            INC={total_INC.count}
            JEHOVAH={total_JEHOVAH.count}
          />
        </div>

        <PerBarangayChart
          total_count_summary_per_brgy={total_count_summary_per_brgy}
          data_brgy={dataPerbrgy}
          dataPerbrgy_unvalidated={dataPerbrgy_unvalidated}
        />
      </div>
    </>
  );
}

export default DashboardLayout;
