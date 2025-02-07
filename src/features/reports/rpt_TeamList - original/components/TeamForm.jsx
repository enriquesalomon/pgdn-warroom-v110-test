import { useRef } from "react";

import ReactToPrint from "react-to-print";
import TeamView from "./TeamView";
import { useTower } from "../hooks/useElectorates";

function TeamForm({ electorate }) {
  const { data: towerData } = useTower(electorate.electorate_id);

  const t_precinctNo =
    towerData && towerData.length > 0 ? towerData[0].precinctno : "";

  const componentRef = useRef();
  return (
    <div>
      <ReactToPrint
        trigger={() => (
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Print
          </button>
        )}
        content={() => componentRef.current}
      />
      <TeamView
        t_precinctNo={t_precinctNo}
        electorate={electorate}
        ref={componentRef}
      />
    </div>
  );
}

export default TeamForm;
