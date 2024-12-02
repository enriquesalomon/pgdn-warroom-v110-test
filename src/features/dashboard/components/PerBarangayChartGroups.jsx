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
import { useSearchParams } from "react-router-dom";
import { validationMapping } from "../../../utils/constants";
import { AiOutlineSplitCells } from "react-icons/ai";
import { useState } from "react";
import { AiOutlineMergeCells } from "react-icons/ai";
const StyledBarChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function PerBarangayChartGroups(
  { data_brgy, dataPerbrgy_unvalidated, total_count_summary_per_brgy },
  viewFull
) {
  const first20 = total_count_summary_per_brgy.slice(0, 20);
  const remaining = total_count_summary_per_brgy.slice(20);

  const [splitChart, setSPlitChart] = useState(false);
  const handleButtonClickSplit = () => {
    setSPlitChart(true);
  };

  const handleButtonClickUnsplit = () => {
    setSPlitChart(false);
  };
  return (
    <>
      {!splitChart && (
        <div>
          <StyledBarChart>
            <div className="flex justify-between">
              <div>
                <Heading as="h2">Per Barangay Classification Chart</Heading>
              </div>
              <div>
                <ButtonIcon onClick={handleButtonClickSplit}>
                  <AiOutlineSplitCells className="mr-2  " />
                </ButtonIcon>
              </div>
            </div>
            <ResponsiveContainer height={300} width="100%">
              <ComposedChart
                width={730}
                height={250}
                data={total_count_summary_per_brgy}
              >
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
        </div>
      )}

      {splitChart && (
        <div>
          <StyledBarChart>
            <div className="flex justify-between">
              <div>
                <Heading as="h2">Per Barangay Classification Chart</Heading>
              </div>
              <div>
                <ButtonIcon onClick={handleButtonClickUnsplit}>
                  <AiOutlineMergeCells className="mr-2  " />
                </ButtonIcon>
              </div>
            </div>
            <ResponsiveContainer height={300} width="100%">
              <ComposedChart width={730} height={250} data={first20}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="brgy" />
                <YAxis />
                <Tooltip />
                {/* <Legend /> */}
                <Bar dataKey="TOTAL_VALIDATED" fill="#007400" />
                <Bar dataKey="TOTAL_ATO" fill="#FFA500" />
                <Bar dataKey="TOTAL_OT" fill="#90CAF9" />
                <Bar dataKey="TOTAL_INC" fill="#8CC640" />
                <Bar dataKey="TOTAL_JEHOVAH" fill="#4A6DA7" />
                <Bar dataKey="TOTAL_UNVALIDATED_DILI" fill="#9E9E9E" />
              </ComposedChart>
            </ResponsiveContainer>
          </StyledBarChart>
          <StyledBarChart>
            {/* <div className="flex justify-between">
          <div>
          <Heading as="h2">Per Barangay Classification Chart</Heading>
          </div>
          </div> */}
            <ResponsiveContainer height={300} width="100%">
              <ComposedChart width={730} height={250} data={remaining}>
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
        </div>
      )}
    </>
  );
}

export default PerBarangayChartGroups;
