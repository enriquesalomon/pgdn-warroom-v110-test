import styled from "styled-components";
import Spinner from "../../../ui/Spinner";
import Stats from "./Stats";
import PerBarangayChart from "./PerBarangayChart";
import ElectoratePieChart from "./ElectoratePieChart";

import {
  useTotalScanned,
  useTotalVoterAto,
  useTotalScannedPerBrgy,
  useTotalAtoPerBrgy,
  useLatesScanned,
  useTotalAto,
} from "../../voters-monitoring/hooks/useElectorates";
import LatestScanned from "./LatestScanned";
// import VotersUnscannedTable from "./VotersUnscannedTable";
// import ElectoratesRow from "./ElectoratesRow";
// import ElectoratesTable from "./ElectoratesTable";
import Row from "../../../ui/Row";
import VotersUnscannedTable from "./VotersUnscannedTable";
import Modal from "../../../ui/Modal";
import ButtonIcon from "../../../ui/ButtonIcon";
import { MdOpenInFull } from "react-icons/md";
import DashboardBox from "./DashboardBox";
import VotersScannedTable from "./VotersScannedTable";
import { useTotal_Count_Summaru_PerBrgy } from "../../dashboard/hooks/useElectorates";

const StyledBox = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;
function DashboardLayout() {
  const { isPending: isPending1, data: total_VoterAto } = useTotalVoterAto();
  console.log("--total voters ato", total_VoterAto);
  // const { isPending: isPending1, data: total_VoterAto } = useTotalAto();
  const { isPending: isPending2, data: total_Scanned } = useTotalScanned();
  const { isPending: isPending3, data: dataScannedPerbrgy } =
    useTotalScannedPerBrgy();
  // const { isPending: isPending4, data: dataAtoPerbrgy } =
  //   useTotal_Count_Summaru_PerBrgy();

  const { isPending: isPending4, data: dataAtoPerbrgy } = useTotalAtoPerBrgy();
  const { isPending: isPending5, data: data_lates_scanned } = useLatesScanned();
  let tot_Unscanned = total_VoterAto - total_Scanned;
  if (isPending1 || isPending2 || isPending3 || isPending4 || isPending5)
    return <Spinner />;
  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <Stats
          tot_Ato={total_VoterAto.count}
          tot_Scanned={total_Scanned.count}
          tot_UnScanned={tot_Unscanned}
        />
        <div className="col-span-2 ...">
          <ElectoratePieChart
            Ato={total_VoterAto.count}
            Scanned={total_Scanned.count}
          />
        </div>
        <div className="col-span-1 ...">
          <LatestScanned data_lates_scanned={data_lates_scanned} />
        </div>
        <PerBarangayChart
          data_ato_perBrgy={dataAtoPerbrgy}
          data_scanned_brgy={dataScannedPerbrgy}
        />
        {/* SCANNED */}
        <div className="col-span-4 ...">
          <StyledBox barWidth={100}>
            <div className="flex justify-between">
              <Row type="horizontal">
                <div></div>
              </Row>

              <div className="">
                <Modal>
                  <Modal.Open opens="service-form">
                    <ButtonIcon>
                      <MdOpenInFull className="mr-2" />
                    </ButtonIcon>
                  </Modal.Open>
                  <Modal.Window
                    backdrop={true}
                    name="service-form"
                    heightvar="100%"
                    widthvar="100%"
                  >
                    <VotersScannedTable />
                  </Modal.Window>
                </Modal>
              </div>
            </div>

            <VotersScannedTable />
          </StyledBox>
        </div>
        {/* UNSCANNED */}
        <div className="col-span-4 ...">
          <StyledBox barWidth={100}>
            <div className="flex justify-between">
              <Row type="horizontal">
                <div></div>
              </Row>

              <div className="">
                <Modal>
                  <Modal.Open opens="service-form">
                    <ButtonIcon>
                      <MdOpenInFull className="mr-2" />
                    </ButtonIcon>
                  </Modal.Open>
                  <Modal.Window
                    backdrop={true}
                    name="service-form"
                    heightvar="100%"
                    widthvar="100%"
                  >
                    <VotersUnscannedTable />
                  </Modal.Window>
                </Modal>
              </div>
            </div>

            <VotersUnscannedTable />
          </StyledBox>
        </div>
      </div>
    </>
  );
}

export default DashboardLayout;
