import { useTower } from "../hooks/useTeams";
import TeamViewTag from "./TeamViewTag";

function TeamFormTag({ electorate }) {
  console.log("yeash", JSON.stringify(electorate));
  const { data: towerData } = useTower(electorate.electorate_id);
  console.log("towerData", JSON.stringify(towerData));
  const t_precinctNo =
    towerData && towerData.length > 0 ? towerData[0].precinctno : "";

  return (
    <div>
      <TeamViewTag t_precinctNo={t_precinctNo} electorate={electorate} />
    </div>
  );
}

export default TeamFormTag;
