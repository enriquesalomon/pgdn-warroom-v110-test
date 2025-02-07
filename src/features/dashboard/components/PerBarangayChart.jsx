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
import { validationMapping } from "../../../utils/constants";
import { useSearchParams } from "react-router-dom";

const StyledBarChart = styled(DashboardBox)`
  grid-column: 1 / -1;

  /* Hack to change grid line colors */
  & .recharts-cartesian-grid-horizontal line,
  & .recharts-cartesian-grid-vertical line {
    stroke: var(--color-grey-300);
  }
`;

function PerBarangayChart(
  { total_count_summary_per_brgy, dataPerbrgy_unvalidated },
  viewFull
) {
  //combining the  total_count_summary_per_brgy and  dataPerbrgy_unvalidated into one object

  // Default values for missing keys
  const defaultValues = {
    count_ato: 0,
    count_dili: 0,
    count_ot: 0,
    count_inc: 0,
    count_jhv: 0,
    count_deceased: 0,
    count_undecided: 0,
    count_nvs: 0,
    count_lubas: 0,
  };

  // Combine data based on 'brgy'
  const combinedData = total_count_summary_per_brgy.data.map((item) => {
    const matchingItem = dataPerbrgy_unvalidated.data.find(
      (secItem) => secItem.brgy === item.brgy
    );
    if (matchingItem) {
      return { ...item, electorate_count: matchingItem.electorate_count };
    }
    return item;
  });

  // Add unmatched items from the second dataset with default values
  dataPerbrgy_unvalidated.data.forEach((secItem) => {
    const exists = total_count_summary_per_brgy.data.some(
      (item) => item.brgy === secItem.brgy
    );
    if (!exists) {
      combinedData.push({
        brgy: secItem.brgy,
        electorate_count: secItem.electorate_count,
        ...defaultValues, // Add default values for missing keys
      });
    }
  });

  console.log("combinedData", JSON.stringify(combinedData));

  const transformedData = combinedData?.map((item) => ({
    brgy: item.brgy,
    TOTAL_ATO: item.count_ato,
    TOTAL_DILI: item.count_dili,
    TOTAL_OT: item.count_ot,
    TOTAL_INC: item.count_inc,
    TOTAL_JEHOVAH: item.count_jhv,
    TOTAL_DECEASED: item.count_deceased,
    TOTAL_UNDECIDED: item.count_undecided,
    TOTAL_NVS: item.count_nvs,
    TOTAL_GOLD_AFFILIATES: item.count_lubas,
    TOTAL_VALIDATED:
      item.count_ato +
      item.count_dili +
      item.count_ot +
      item.count_inc +
      item.count_jhv +
      item.count_deceased +
      item.count_undecided +
      item.count_nvs +
      item.count_lubas,
    TOTAL_UNVALIDATED: item.electorate_count,
  }));

  const [searchParams] = useSearchParams();
  let validationType = searchParams.get("validation");
  validationType = validationMapping[validationType] || "Survey";
  validationType =
    validationType === "third_validation"
      ? "3rd Validation"
      : validationType === "second_validation"
      ? "2nd Validation"
      : validationType === "first_validation"
      ? "1st Validation"
      : "Survey";

  return (
    <StyledBarChart>
      <div className="flex justify-between">
        <div>
          <Heading as="h2">Per Barangay Classification Chart</Heading>
          <span className="ml-7">{validationType}</span>
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
                  validationType={validationType}
                  // dataPerbrgy_unvalidated={dataPerbrgy_unvalidated}
                  total_count_summary_per_brgy={transformedData}
                  // data_brgy={dataPerbrgy}
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
          <Bar dataKey="TOTAL_VALIDATED" fill="#B75CFF" />
          <Bar dataKey="TOTAL_ATO" fill="#DCFCE7" />
          <Bar dataKey="TOTAL_DILI" fill="#FEE2E2" />
          <Bar dataKey="TOTAL_OT" fill="#FB9EC6" />
          <Bar dataKey="TOTAL_INC" fill="#00FF9C" />
          <Bar dataKey="TOTAL_JEHOVAH" fill="#F3F4F6" />
          <Bar dataKey="TOTAL_DECEASED" fill="#080808" />
          <Bar dataKey="TOTAL_UNDECIDED" fill="#FEF9C3" />
          <Bar dataKey="TOTAL_NVS" fill="#FFC966" />
          <Bar dataKey="TOTAL_GOLD_AFFILIATES" fill="#E8B903" />
          {/* <Bar dataKey="TOTAL_UNVALIDATED" fill="#9E9E9E" /> */}
        </ComposedChart>
      </ResponsiveContainer>
    </StyledBarChart>
  );
}

export default PerBarangayChart;
