import React from "react";
import Tag from "../../ui/Tag";
import {
  useKamadaResult,
  useTotal_Count_Summaru_PerBrgy,
} from "../kamada/hooks/useElectorates";
import Heading from "../../ui/Heading";

function BrgyData({ brgy }) {
  // const { isPending, kamada_result } = useKamadaResult();
  const { data: total_count_summary_per_brgy } =
    useTotal_Count_Summaru_PerBrgy();

  // Find the data for the specific barangay (brgy)
  const brgyData = total_count_summary_per_brgy?.data.find(
    (item) => item.brgy === brgy
  );
  console.log("brgyDatass", JSON.stringify(total_count_summary_per_brgy));
  if (!brgyData) {
    return <div>No data available for {brgy}</div>;
  }

  return (
    <div>
      {/* <h1 className="mb-6">{brgy}</h1> */}
      <Heading as="h2">{brgy}</Heading>
      <table>
        <thead>
          <tr>
            <th>CLASSIFICATION</th>
            <th>TOTAL COUNT</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Tag type="green">ATO</Tag>
            </td>
            <td className="text-lg font-extrabold">{brgyData.count_ato}</td>
          </tr>
          <tr>
            <td>
              <Tag type="red">DILI</Tag>
            </td>
            <td className="text-lg font-extrabold">{brgyData.count_dili}</td>
          </tr>
          <tr>
            <td>
              <Tag type="pink">OUT OF TOWN</Tag>
            </td>
            <td className="text-lg font-extrabold">{brgyData.count_ot}</td>
          </tr>
          <tr>
            <td>
              <Tag type="yellow">UNDECIDED</Tag>
            </td>
            <td className="text-lg font-extrabold">
              {brgyData.count_undecided}
            </td>
          </tr>
          <tr>
            <td>
              <Tag type="orange">NVS</Tag>
            </td>
            <td className="text-lg font-extrabold">{brgyData.count_nvs}</td>
          </tr>
          <tr>
            <td>
              <Tag type="black">DECEASED</Tag>
            </td>
            <td className="text-lg font-extrabold">
              {brgyData.count_deceased}
            </td>
          </tr>
          <tr>
            <td>
              <Tag type="mint">INC</Tag>
            </td>
            <td className="text-lg font-extrabold">{brgyData.count_inc}</td>
          </tr>
          <tr>
            <td>
              <Tag type="grey">JEHOVAH</Tag>
            </td>
            <td className="text-lg font-extrabold">{brgyData.count_jhv}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default BrgyData;
