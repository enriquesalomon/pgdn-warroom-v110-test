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
  // Map over the data array and rename the 'result' property to 'ato' in each object to use in Total Ato data
  const modifiedData = data_ato_perBrgy.data.map((entry) => {
    return {
      ato: entry.result,
      brgy: entry.brgy,
    };
  });

  // Create new object with the modified data
  const new_data_ato_perBrgy = {
    data: modifiedData,
  };

  const combinedData = [
    ...new_data_ato_perBrgy.data,
    ...data_scanned_brgy.data,
  ];

  const transformedData = combinedData.reduce((acc, item) => {
    // const transformedData = fakeData.reduce((acc, item) => {
    const { result, ato, brgy } = item;

    // e Check if 'brgy' already exists na sa accumulator
    const existingEntry = acc.find((entry) => entry.brgy === brgy);

    if (existingEntry) {
      if (result === 10) {
        existingEntry.TOTAL_SCANNED++;
      }
      if (ato === 1) {
        existingEntry.TOTAL_VOTERS++;
      }
      existingEntry.TOTAL_UNSCANNED =
        existingEntry.TOTAL_VOTERS - existingEntry.TOTAL_SCANNED;
    } else {
      // Create new entry for new 'brgy'
      const newEntry = {
        brgy: brgy,
        TOTAL_SCANNED: result === 10 ? 1 : 0,
        TOTAL_VOTERS: ato === 1 ? 1 : 0,
        TOTAL_UNSCANNED: ato === 1 ? 1 : 0,
      };
      acc.push(newEntry);
    }

    return acc;
  }, []);

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

  // Log the transformed data
  // console.log(JSON.stringify({ data: transformedData }));

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
                <Bar dataKey="TOTAL_VOTERS" fill="#FFA500" />
                <Bar dataKey="TOTAL_SCANNED" fill="#469E67" />
                <Bar dataKey="TOTAL_UNSCANNED" fill="#9CA3AF" />
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
                <Bar dataKey="TOTAL_VOTERS" fill="#FFA500" />
                <Bar dataKey="TOTAL_SCANNED" fill="#469E67" />
                <Bar dataKey="TOTAL_UNSCANNED" fill="#9CA3AF" />
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
                <Bar dataKey="TOTAL_VOTERS" fill="#FFA500" />
                <Bar dataKey="TOTAL_SCANNED" fill="#469E67" />
                <Bar dataKey="TOTAL_UNSCANNED" fill="#9CA3AF" />
              </ComposedChart>
            </ResponsiveContainer>
          </StyledBarChart>
        </div>
      )}
    </>
  );
}

export default PerBarangayChartGroups;
