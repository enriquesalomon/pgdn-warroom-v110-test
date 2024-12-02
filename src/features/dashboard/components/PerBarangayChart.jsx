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

const StyledBarChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function PerBarangayChart(
  { data_brgy, dataPerbrgy_unvalidated, total_count_summary_per_brgy },
  viewFull
) {
  const transformedData = total_count_summary_per_brgy.data.map((item) => ({
    brgy: item.brgy,
    TOTAL_ATO:
      item.warriors +
      item.baco_count +
      item.gm_count +
      item.agm_count +
      item.legend_count +
      item.elite_count,
    TOTAL_OT: item.ot_count,
    TOTAL_INC: item.inc_count,
    TOTAL_JEHOVAH: item.jehovah_count,
    TOTAL_VALIDATED:
      item.warriors +
      item.baco_count +
      item.gm_count +
      item.agm_count +
      item.legend_count +
      item.elite_count +
      item.ot_count +
      item.inc_count +
      item.jehovah_count, // Assuming TOTAL_VALIDATED is not provided in the first data
    TOTAL_UNVALIDATED_DILI: item.unvalidated_count,
  }));

  return (
    <StyledBarChart>
      <div className="flex justify-between">
        <div>
          <Heading as="h2">Per Barangay Classification Chart</Heading>
          {/* <span className="ml-7">{validationType}</span> */}
        </div>
        {viewFull && (
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
                <PerBarangayChartGroups
                  total_count_summary_per_brgy={transformedData}
                  data_brgy={data_brgy}
                  dataPerbrgy_unvalidated={dataPerbrgy_unvalidated}
                />
              </Modal.Window>
            </Modal>
          </div>
        )}
      </div>
      <ResponsiveContainer height={300} width="100%">
        <ComposedChart width={730} height={250} data={transformedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="brgy" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="TOTAL_VALIDATED" fill="#007400" />
          <Bar dataKey="TOTAL_ATO" fill="#FFA500" />
          <Bar dataKey="TOTAL_OT" fill="#90CAF9" />
          <Bar dataKey="TOTAL_INC" fill="#8CC640" />
          <Bar dataKey="TOTAL_JEHOVAH" fill="#4A6DA7" />
          <Bar dataKey="TOTAL_UNVALIDATED_DILI" fill="#9E9E9E" />
        </ComposedChart>
      </ResponsiveContainer>
    </StyledBarChart>
  );
}

export default PerBarangayChart;
