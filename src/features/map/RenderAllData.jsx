import React, { useEffect } from "react";
import {
  useKamadaResult,
  useTotal_Count_Summaru_PerBrgy,
} from "../kamada/hooks/useElectorates";

function RenderAllData({ brgy, onDataAvailable }) {
  const { isPending, kamada_result } = useKamadaResult();
  const { data: total_count_summary_per_brgy } =
    useTotal_Count_Summaru_PerBrgy();

  console.log("data of brgy", total_count_summary_per_brgy);

  const brgyData = total_count_summary_per_brgy?.data.find(
    (item) => item.brgy === brgy
  );

  useEffect(() => {
    if (brgyData) {
      onDataAvailable(brgyData);
    }
  }, [brgyData, onDataAvailable]);

  return null;
}
export default RenderAllData;
