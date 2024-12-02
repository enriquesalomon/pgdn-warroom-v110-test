import React, { useRef } from "react";
import ReactToPrint from "react-to-print";

const Members = ({ selectedRowData }) => {
  const data = selectedRowData[0];
  console.log("xxxxx--", JSON.stringify(data.members_name));

  const members_only = data.members_name.filter(
    (item) => item.id !== data.electorate_id
  );
  const componentRef = useRef();
  return (
    <>
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
      <div
        className="border duration-300 rounded-lg p-9 mt-4"
        ref={componentRef}
      >
        <div className="grid  grid-cols-[0.4fr_2fr] gap-1 text-2xl">
          <div className="font-semibold">GM</div>
          <div>{data.gm_name}</div>

          <div className="font-semibold">AGM</div>
          <div>{data.agm_name}</div>

          <div className="font-semibold">LEGEND</div>
          <div>{data.legend_name}</div>

          <div className="font-semibold">ELITE</div>
          <div>{data.elite_name}</div>
          <div className="font-semibold">TOWER</div>
          <div>
            {data.firstname} {data.lastname}
          </div>
        </div>
        <div className="font-semibold mt-6">MEMBERS</div>
        <hr />
        <table className="w-full text-left mt-4 text-2xl">
          <tbody>
            {data && members_only && members_only.length > 0 ? (
              members_only.map((member, index) => (
                <tr key={member.id} className="mt-2">
                  <td>{`${index + 1}. ${member.label}`}</td>
                </tr>
              ))
            ) : (
              <tr className="text-center h-32">
                <td colSpan={1}>No Members Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Members;
