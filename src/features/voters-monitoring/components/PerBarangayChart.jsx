import styled from "styled-components";
import DashboardBox from "./DashboardBox";
import Heading from "../../../ui/Heading";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Modal from "../../../ui/Modal";
import ButtonIcon from "../../../ui/ButtonIcon";
import { MdOpenInFull } from "react-icons/md";
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
  console.log("data_scanned_brgy", JSON.stringify(data_scanned_brgy));
  console.log("data_ato_perBrgy", JSON.stringify(data_ato_perBrgy));
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
  console.log("modifiedData", JSON.stringify(modifiedData));
  console.log("combinedData", JSON.stringify(combinedData));
  const transformedData = combinedData.reduce((acc, item) => {
    // const transformedData = fakeData.reduce((acc, item) => {
    const { result, ato, brgy } = item;

    // e Check if 'brgy' already exists na sa accumulator
    const existingEntry = acc.find((entry) => entry.brgy === brgy);

    if (existingEntry) {
      if (result === 4) {
        existingEntry.TOTAL_SCANNED++;
      }
      if (ato === 1) {
        existingEntry.TOTAL_VOTERS++;
      }
      existingEntry.TOTAL_UNSCANNED =
        existingEntry.TOTAL_VOTERS - existingEntry.TOTAL_SCANNED;
      console.log("total unscann accumulator", existingEntry.TOTAL_UNSCANNED);
    } else {
      // Create new entry for new 'brgy'
      const newEntry = {
        brgy: brgy,
        TOTAL_SCANNED: result === 4 ? 1 : 0,
        TOTAL_VOTERS: ato === 1 ? 1 : 0,
        TOTAL_UNSCANNED: ato === 1 ? 1 : 0,
      };
      acc.push(newEntry);
      console.log("running diri");
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
              <PerBarangayChart
                data_ato_perBrgy={data_ato_perBrgy}
                data_scanned_brgy={data_scanned_brgy}
              />
            </Modal.Window>
          </Modal>
        </div>
      </div>
      <ResponsiveContainer height={300} width="100%">
        <ComposedChart width={730} height={250} data={sorted_transformedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="brgy" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="TOTAL_VOTERS" fill="#145A32" />
          <Bar dataKey="TOTAL_SCANNED" fill="#0369A1" />
          <Bar dataKey="TOTAL_UNSCANNED" fill="#9CA3AF" />
        </ComposedChart>
      </ResponsiveContainer>
    </StyledBarChart>
  );
}

export default PerBarangayChart;

// import styled from "styled-components";
// import DashboardBox from "./DashboardBox";
// import Heading from "../../../ui/Heading";
// import {
//   Bar,
//   CartesianGrid,
//   ComposedChart,
//   Legend,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import Modal from "../../../ui/Modal";
// import ButtonIcon from "../../../ui/ButtonIcon";
// import { MdOpenInFull } from "react-icons/md";
// import PerBarangayChartGroups from "./PerBarangayChartGroups";
// // import { useDarkMode } from "../../../context/DarkModeContext";

// const StyledBarChart = styled(DashboardBox)`
//   grid-column: 1 / -1;

//   /* Hack to change grid line colors */
//   & .recharts-cartesian-grid-horizontal line,
//   & .recharts-cartesian-grid-vertical line {
//     stroke: var(--color-grey-300);
//   }
// `;

// function PerBarangayChart({ data_scanned_brgy, data_ato_perBrgy }) {
//   console.log("xxxxx-----xxxx1", JSON.stringify(data_ato_perBrgy));
//   // Combine data
//   console.log("xxxxx-----xxxx2", JSON.stringify(data_scanned_brgy));
//   const combinedData = data_ato_perBrgy.data.map((item) => {
//     const match = data_scanned_brgy.data.find((d) => d.brgy === item.brgy);
//     return {
//       ...item,
//       total_count_scanned: match ? match.count : 0,
//     };
//   });
//   console.log("xxxxx-----xxxx3", JSON.stringify(combinedData));
//   const transformedData = combinedData.map((item) => ({
//     brgy: item.brgy,
//     TOTAL_VOTERS_ATO:
//       item.warriors +
//       item.baco_count +
//       item.gm_count +
//       item.agm_count +
//       item.legend_count +
//       item.elite_count,
//     TOTAL_SCANNED: item.total_count_scanned,
//     TOTAL_UNSCANNED:
//       item.warriors +
//       item.baco_count +
//       item.gm_count +
//       item.agm_count +
//       item.legend_count +
//       item.elite_count -
//       item.total_count_scanned,
//   }));
//   return (
//     <StyledBarChart>
//       <div className="flex justify-between">
//         <div>
//           <Heading as="h2">Per Barangay Voters Chart</Heading>{" "}
//         </div>

//         <div>
//           <Modal>
//             <Modal.Open opens="service-form">
//               <ButtonIcon>
//                 <MdOpenInFull className="mr-2  " />
//               </ButtonIcon>
//             </Modal.Open>
//             <Modal.Window
//               backdrop={true}
//               name="service-form"
//               heightvar="100%"
//               widthvar="100%"
//             >
//               {/* da  */}

//               <PerBarangayChartGroups
//                 data_ato_perBrgy={data_ato_perBrgy}
//                 data_scanned_brgy={data_scanned_brgy}
//               />
//             </Modal.Window>
//           </Modal>
//         </div>
//       </div>
//       <ResponsiveContainer height={300} width="100%">
//         <ComposedChart width={730} height={250} data={transformedData}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="brgy" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Bar dataKey="TOTAL_VOTERS_ATO" fill="#52BE80" />
//           <Bar dataKey="TOTAL_SCANNED" fill="#145A32" />
//           {/* <Bar dataKey="TOTAL_UNSCANNED" fill="#9CA3AF" /> */}
//         </ComposedChart>
//       </ResponsiveContainer>
//     </StyledBarChart>
//   );
// }

// export default PerBarangayChart;
