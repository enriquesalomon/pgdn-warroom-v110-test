import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import Heading from "../../../ui/Heading";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Modal from "../../../ui/Modal";
import ButtonIcon from "../../../ui/ButtonIcon";
import { MdOpenInFull } from "react-icons/md";
import PerBarangayChartGroups from "./PerBarangayChartGroups";
// import { useDarkMode } from "../../../context/DarkModeContext";

const StyledBarChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function PerBarangayChart({ data_scanned_brgy, data_ato_perBrgy }) {
  console.log("xxxxx-----xxxx", JSON.stringify(data_ato_perBrgy));
  // Combine data
  const combinedData = data_ato_perBrgy.data.map((item) => {
    const match = data_scanned_brgy.data.find((d) => d.brgy === item.brgy);
    return {
      ...item,
      total_count_scanned: match ? match.count : 0,
    };
  });

  const transformedData = combinedData.map((item) => ({
    brgy: item.brgy,
    TOTAL_VOTERS_ATO:
      item.warriors +
      item.baco_count +
      item.gm_count +
      item.agm_count +
      item.legend_count +
      item.elite_count,
    TOTAL_SCANNED: item.total_count_scanned,
    TOTAL_UNSCANNED:
      item.warriors +
      item.baco_count +
      item.gm_count +
      item.agm_count +
      item.legend_count +
      item.elite_count -
      item.total_count_scanned,
  }));
  return (
    <StyledBarChart>
      <div className="flex justify-between">
        <div>
          <Heading as="h2">Per Barangay Voters Chart</Heading>{" "}
        </div>

        <div>
          <Modal>
            <Modal.Open opens="service-form">
              <ButtonIcon>
                <MdOpenInFull className="mr-2  " />
              </ButtonIcon>
            </Modal.Open>
            <Modal.Window
              backdrop={true}
              name="service-form"
              heightvar="100%"
              widthvar="100%"
            >
              {/* da  */}

              <PerBarangayChartGroups
                data_ato_perBrgy={data_ato_perBrgy}
                data_scanned_brgy={data_scanned_brgy}
              />
            </Modal.Window>
          </Modal>
        </div>
      </div>
      <ResponsiveContainer height={300} width="100%">
        <ComposedChart width={730} height={250} data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="brgy" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="TOTAL_VOTERS_ATO" fill="#FFA500" />
          <Bar dataKey="TOTAL_SCANNED" fill="#469E67" />
          {/* <Bar dataKey="TOTAL_UNSCANNED" fill="#9CA3AF" /> */}
        </ComposedChart>
      </ResponsiveContainer>
    </StyledBarChart>
  );
}

export default PerBarangayChart;
