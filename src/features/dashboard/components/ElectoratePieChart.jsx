import styled from "styled-components";
import Heading from "../../../ui/Heading";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useDarkMode } from "../../../context/DarkModeContext";
import Modal from "../../../ui/Modal";
import ButtonIcon from "../../../ui/ButtonIcon";
import { MdOpenInFull } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { validationMapping } from "../../../utils/constants";

const ChartBox = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);

  padding: 2.4rem 3.2rem;
  grid-column: 3 / span 2;

  & > *:first-child {
    margin-bottom: 1.6rem;
  }

  & .recharts-pie-label-text {
    font-weight: 600;
  }
`;

function ElectoratePieChart({
  tot_Validated,
  tot_Electorates,
  Ato,
  Unvalidated_Dili,
  tot_Ato_groundManagement,
  OT,
  INC,
  JEHOVAH,
  isZoom,
}) {
  const tot_dili_unvalidate =
    tot_Electorates - (tot_Validated + tot_Ato_groundManagement);
  const { isDarkMode } = useDarkMode();
  const total =
    tot_Ato_groundManagement + Ato + Unvalidated_Dili + OT + INC + JEHOVAH;

  // alert(total); 71005
  const startDataLight = [
    {
      category: "UNVALIDATED_DILI",
      value: tot_dili_unvalidate,
      // value: Unvalidated_Dili,
      color: "#9E9E9E",
    },
    {
      category: "ATO",
      value: Ato + tot_Ato_groundManagement,
      color: "#FFA500",
    },

    // {
    //   category: "UNDECIDED",
    //   value: Undecided,
    //   color: "#9CA3AF",
    // },
    // {
    //   category: "DECEASED",
    //   value: Deceased,
    //   color: "#080808",
    // },
    {
      category: "Out of Town",
      value: OT,
      color: "#90CAF9",
    },
    {
      category: "INC",
      value: INC,
      color: "#8CC640",
    },
    {
      category: "JEHOVAH",
      value: JEHOVAH,
      color: "#4A6DA7",
    },
  ];

  const startDataDark = [
    {
      category: "UNVALIDATED_DILI",
      value: tot_dili_unvalidate,
      color: "#9E9E9E",
    },
    {
      category: "Ato",
      value: Ato + tot_Ato_groundManagement,
      color: "#FFA500",
    },

    // {
    //   category: "Undecided",
    //   value: Undecided,
    //   color: "#9CA3AF",
    // },
    // {
    //   category: "Deceased",
    //   value: Deceased,
    //   color: "#080808",
    // },

    {
      category: "Out of Town",
      value: OT,
      color: "#90CAF9",
    },
    {
      category: "INC",
      value: OT,
      color: "#8CC640",
    },
    {
      category: "JEHOVAH",
      value: JEHOVAH,
      color: "#4A6DA7",
    },
  ];

  const startData = isDarkMode ? startDataDark : startDataLight;

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    // Render label only if percent is greater than zero
    if (percent > 0) {
      return (
        <>
          {/* White circle to create a border effect inside the pie segment */}
          <circle
            cx={cx}
            cy={cy}
            r={innerRadius + (outerRadius - innerRadius) * 0.02}
            fill="white"
          />
          {/* Percentage label */}
          <text
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
          >
            {/* {`${percent * 100}%`} */}
            {`${(percent * 100).toFixed(2)}%`}
          </text>
        </>
      );
    }

    return null; // Return null if percent is zero
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">
            Total {`${payload[0].name} : ${payload[0].value}`}
          </p>
        </div>
      );
    }

    return null;
  };
  const [searchParams] = useSearchParams();
  let validationType = searchParams.get("validation");
  validationType = validationMapping[validationType] || "first_validation";
  validationType =
    validationType === "third_validation"
      ? "3rd Validation"
      : validationType === "second_validation"
      ? "2nd Validation"
      : "1st Validation";
  return (
    <ChartBox>
      <div className="flex justify-between">
        <div>
          <Heading as="h2">Electorate Classification Chart</Heading>
          <Heading className="underline decoration-solid" as="h6">
            Including Unvalidated Data
          </Heading>
          {/* <span className="ml-7">{validationType}</span> */}
        </div>

        {!isZoom && (
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
                heightvar="50%"
                widthvar="50%"
              >
                <ElectoratePieChart
                  tot_Validated={tot_Validated}
                  tot_Electorates={tot_Electorates}
                  Ato={Ato}
                  tot_Ato_groundManagement={tot_Ato_groundManagement}
                  Unvalidated_Dili={Unvalidated_Dili}
                  OT={OT}
                  INC={INC}
                  JEHOVAH={JEHOVAH}
                  isZoom={true}
                />
              </Modal.Window>
            </Modal>
          </div>
        )}
      </div>

      {/* <Heading as="h2">Electorate Classification Chart</Heading> */}
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={startData}
            nameKey="category"
            dataKey="value"
            cx="40%"
            cy="50%"
            labelLine={true}
            label={renderCustomizedLabel}
            outerRadius={110}
            sectorBorderColor="white"
            sectorBorderWidth={5}
          >
            {startData.map((entry) => (
              <Cell
                fill={entry.color}
                stroke={entry.color}
                key={entry.category}
              />
            ))}
            {startData.map((entry, index) => (
              <text
                key={`text-${index}`}
                x={
                  entry.value / total > 0.1
                    ? Math.cos(-Math.PI / 2 + 2 * Math.PI * entry.midAngle) * 70
                    : null
                }
                y={
                  entry.value / total > 0.1
                    ? Math.sin(-Math.PI / 2 + 2 * Math.PI * entry.midAngle) * 70
                    : null
                }
                fill="white"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {`${((entry.value / total) * 100).toFixed(2)}%`}
              </text>
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="middle"
            align="right"
            width="30%"
            layout="vertical"
            iconSize={15}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

export default ElectoratePieChart;
