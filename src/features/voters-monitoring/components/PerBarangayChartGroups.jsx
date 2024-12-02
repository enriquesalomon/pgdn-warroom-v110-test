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
import { AiOutlineSplitCells } from "react-icons/ai";
import { AiOutlineMergeCells } from "react-icons/ai";
import { useState } from "react";
// import { useDarkMode } from "../../../context/DarkModeContext";

const StyledBarChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function PerBarangayChartGroups({ data_scanned_brgy, data_ato_perBrgy }) {
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

  const sorted_transformedData = transformedData.slice().sort((a, b) => {
    const barangayA = a.brgy.toUpperCase(); // Convert to uppercase for case-insensitive comparison
    const barangayB = b.brgy.toUpperCase(); // Convert to uppercase for case-insensitive comparison

    if (barangayA < barangayB) {
      return -1; // If barangayA should come before barangayB
    }
    if (barangayA > barangayB) {
      return 1; // If barangayA should come after barangayB
    }
    return 0; // If barangayA and barangayB are the same
  });

  // const { isDarkMode } = useDarkMode();

  const first20 = sorted_transformedData.slice(0, 20);
  // Get the remaining objects
  const remaining = sorted_transformedData.slice(20);

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
                <Heading as="h2">Per Barangay Voters Chart</Heading>{" "}
              </div>
              <div>
                <ButtonIcon onClick={handleButtonClickSplit}>
                  <AiOutlineSplitCells className="mr-2  " />
                </ButtonIcon>
              </div>
              {/* 
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
              <PerBarangayChart
                data_ato_perBrgy={data_ato_perBrgy}
                data_scanned_brgy={data_scanned_brgy}
              />
            </Modal.Window>
          </Modal>
        </div> */}
            </div>
            <ResponsiveContainer height={300} width="100%">
              <ComposedChart
                width={730}
                height={250}
                data={sorted_transformedData}
              >
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
        </div>
      )}

      {splitChart && (
        <div>
          <StyledBarChart>
            <div className="flex justify-between">
              <div>
                <Heading as="h2">Per Barangay Voters Chart</Heading>{" "}
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
                <Bar dataKey="TOTAL_VOTERS_ATO" fill="#FFA500" />
                <Bar dataKey="TOTAL_SCANNED" fill="#469E67" />
                {/* <Bar dataKey="TOTAL_UNSCANNED" fill="#9CA3AF" /> */}
              </ComposedChart>
            </ResponsiveContainer>
          </StyledBarChart>
          <StyledBarChart>
            <ResponsiveContainer height={300} width="100%">
              <ComposedChart width={730} height={250} data={remaining}>
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
        </div>
      )}
    </>
  );
}

export default PerBarangayChartGroups;
