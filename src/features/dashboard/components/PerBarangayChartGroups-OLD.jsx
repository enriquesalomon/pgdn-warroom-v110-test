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
  { data_brgy, dataPerbrgy_unvalidated },
  viewFull
) {
  const transformedData = data_brgy.data.reduce((acc, item) => {
    const { result, brgy } = item;

    // e Check if 'brgy' already exists na sa accumulator
    const existingEntry = acc.find((entry) => entry.brgy === brgy);

    if (existingEntry) {
      if (result === 0) {
        existingEntry.TOTAL_DILI++;
      } else if (result === 1) {
        existingEntry.TOTAL_ATO++;
      } else if (result === 4) {
        existingEntry.TOTAL_OT++;
      } else if (result === 5) {
        existingEntry.TOTAL_INC++;
      } else if (result === 6) {
        existingEntry.TOTAL_JEHOVAH++;
      }
      // Increment and total electorate count
      existingEntry.TOTAL_VALIDATED++;
    } else {
      // Create new entry for new 'brgy'
      // const newEntry = {
      //   brgy: brgy,
      //   TOTAL_DILI: result === 0 ? 1 : 0,
      //   TOTAL_ATO: result === 1 ? 1 : 0,
      //   TOTAL_UNDECIDED: result === 2 ? 1 : 0,
      //   TOTAL_DECEASED: result === 3 ? 1 : 0,
      //   TOTAL_VALIDATED: 1, // Initialize total electorate count to 1 for new entry
      // };
      const newEntry = {
        brgy: brgy,
        TOTAL_ATO: result === 1 ? 1 : 0,
        TOTAL_OT: result === 4 ? 1 : 0,
        TOTAL_INC: result === 5 ? 1 : 0,
        TOTAL_JEHOVAH: result === 6 ? 1 : 0,
        TOTAL_VALIDATED: 1, // Initialize total electorate count to 1 for new entry
      };
      acc.push(newEntry);
    }

    return acc;
  }, []);

  //merging the two datas into new Final Array of Objects

  const firstData = dataPerbrgy_unvalidated;

  // Second data
  const secondData = transformedData;

  // Default values for missing keys
  const defaultValues = {
    TOTAL_ATO: 0,
    TOTAL_OT: 0,
    TOTAL_INC: 0,
    TOTAL_JEHOVAH: 0,
    TOTAL_VALIDATED: 0,
  };

  // Merge the data and rename `electorate_count` to `TOTAL_UNVALIDATED`
  const mergedData = firstData.data.map((item) => {
    const matchingBrgy = secondData.find((d) => d.brgy === item.brgy);

    // Renaming the field
    const renamedItem = {
      ...item,
      TOTAL_UNVALIDATED_DILI: item.electorate_count,
    };
    delete renamedItem.electorate_count;

    return {
      ...defaultValues,
      ...renamedItem,
      ...matchingBrgy,
    };
  });

  const sorted_transformedData = mergedData.slice().sort((a, b) => {
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

  const first20 = sorted_transformedData.slice(0, 20);
  // Get the remaining objects
  const remaining = sorted_transformedData.slice(20);
  // const { isDarkMode } = useDarkMode();
  const [searchParams] = useSearchParams();
  let validationType = searchParams.get("validation");
  validationType = validationMapping[validationType] || "first_validation";
  validationType =
    validationType === "third_validation"
      ? "3rd Validation"
      : validationType === "second_validation"
      ? "2nd Validation"
      : "1st Validation";

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
                data={sorted_transformedData}
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
