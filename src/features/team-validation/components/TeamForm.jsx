import TeamView from "./TeamView";
import { useTower } from "../hooks/useElectorates";

function TeamForm({ electorate }) {
  console.log("yeash", JSON.stringify(electorate));
  const { data: towerData } = useTower(electorate.electorate_id);

  const t_precinctNo =
    towerData && towerData.length > 0 ? towerData[0].precinctno : "";

  return (
    <div>
      <TeamView t_precinctNo={t_precinctNo} electorate={electorate} />
    </div>
  );
}

export default TeamForm;
