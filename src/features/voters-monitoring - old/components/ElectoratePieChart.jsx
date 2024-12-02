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
import { data } from "autoprefixer";
import Modal from "../../../ui/Modal";
import ButtonIcon from "../../../ui/ButtonIcon";
import { MdOpenInFull } from "react-icons/md";

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

function ElectoratePieChart({ Ato, Scanned, isZoom }) {
  const { isDarkMode } = useDarkMode();
  const total = Ato;
  const Unscanned = Ato - Scanned;
  const startDataLight = [
    {
      category: "SCANNED",
      value: Scanned,
      color: "#469E67",
    },
    {
      category: "UNSCANNED",
      value: Unscanned,
      color: "#9CA3AF",
    },
  ];

  const startDataDark = [
    {
      category: "SCANNED",
      value: Scanned,
      color: "#469E67",
    },
    {
      category: "UNSCANNED",
      value: Unscanned,
      color: "#9CA3AF",
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
  return (
    <ChartBox>
      <div className="flex justify-between">
        <div>
          <Heading as="h2">Voters Status Chart</Heading>
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
                <ElectoratePieChart Ato={Ato} Scanned={Scanned} isZoom={true} />
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
