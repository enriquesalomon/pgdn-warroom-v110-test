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
import ElectoratePieChart from "./ElectoratePieChart";

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

function ElectoratePieChartExcludeUV({
  dili,
  Ato,
  OT,
  INC,
  JEHOVAH,
  undecided,
  deceased,
  nvs,
  isZoom,
  lubas,
}) {
  const { isDarkMode } = useDarkMode();
  // const total = Ato + Dili + Undecided + Deceased;
  const total = Ato + OT + dili + INC + JEHOVAH;

  // alert(total); 71005
  const startDataLight = [
    {
      category: "ATO",
      value: Ato,
      color: "#489369",
    },
    {
      category: "DILI",
      value: dili,
      color: "#FEE2E2",
    },

    {
      category: "UNDECIDED",
      value: undecided,
      color: "#FEF9C3",
    },
    {
      category: "DECEASED",
      value: deceased,
      color: "#080808",
    },
    {
      category: "Out of Town",
      value: OT,
      color: "#FB9EC6",
    },
    {
      category: "INC",
      value: INC,
      color: "#00FF9C",
    },
    {
      category: "JEHOVAH",
      value: JEHOVAH,
      color: "#F3F4F6",
    },
    {
      category: "NVS",
      value: nvs,
      color: "#FFC966",
    },
    {
      category: "GOLD AFFILIATES",
      value: lubas,
      color: "#E8B903",
    },
  ];

  const startDataDark = [
    {
      category: "Ato",
      value: Ato,
      color: "#145A32",
    },
    {
      category: "DILI",
      value: dili,
      color: "#FF0000",
    },
    {
      category: "Undecided",
      value: undecided,
      color: "#9CA3AF",
    },
    {
      category: "Deceased",
      value: deceased,
      color: "#080808",
    },

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
    {
      category: "NVS",
      value: nvs,
      color: "#e9f57a",
    },
    {
      category: "GOLD AFFILIATES",
      value: lubas,
      color: "#E8B903",
    },
  ];

  const startData = isDarkMode ? startDataLight : startDataLight;
  const renderCustomLegend = (props) => {
    const { payload } = props; // `payload` contains legend data
    return (
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {payload.map((entry, index) => (
          <li
            key={`item-${index}`}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
              color: "black", // Set the text color to black
              fontSize: "14px", // Optional: Customize font size
            }}
          >
            <span
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: entry.color,
                display: "inline-block",
                marginRight: "8px",
                borderRadius: "50%",
              }}
            ></span>
            {entry.value}
          </li>
        ))}
      </ul>
    );
  };
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
            fill="black"
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
    <ChartBox>
      <div className="flex justify-between">
        <div>
          <Heading as="h2">Electorate Classification Chart</Heading>
          {/* <Heading className="underline decoration-solid" as="h6">
            Excluding Unvalidated Data
          </Heading> */}
          <span className="ml-7">{validationType}</span>
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
                <ElectoratePieChartExcludeUV
                  // dili={dili}
                  // Ato={Ato}
                  // OT={OT}
                  // INC={INC}
                  // JEHOVAH={JEHOVAH}
                  // isZoom={true}
                  dili={dili}
                  Ato={Ato}
                  OT={OT}
                  INC={INC}
                  JEHOVAH={JEHOVAH}
                  undecided={undecided}
                  deceased={deceased}
                  nvs={nvs}
                  isZoom={isZoom}
                  lubas={lubas}
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
            content={renderCustomLegend}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartBox>
  );
}

export default ElectoratePieChartExcludeUV;
