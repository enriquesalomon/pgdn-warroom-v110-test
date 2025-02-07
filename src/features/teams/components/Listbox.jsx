import React, { useState, useEffect } from "react";
import { replaceSpecialChars } from "../../../utils/helpers";

const Listbox = ({ selectedWarriors_Tower, max, tower_id, isEditSession }) => {
  console.log("xxxxxxxxxxxxxxxxx---", JSON.stringify(tower_id));
  console.log(
    "selectedElectorates Listbox",
    JSON.stringify(selectedWarriors_Tower)
  );
  let selectedElectorates;
  if (isEditSession) {
    selectedElectorates = selectedWarriors_Tower.filter(
      (item) => item.value !== tower_id
    );
  } else {
    selectedElectorates = selectedWarriors_Tower.filter(
      (item) => item.value.id !== tower_id
    );
  }

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (Array.isArray(selectedElectorates)) {
      const mappedItems = selectedElectorates.map((electorate) => {
        if (typeof electorate.value === "object") {
          // Complex object
          return {
            id: electorate.value.id,
            precinctno: electorate.value.precinctno,
            firstname: electorate.value.firstname,
            middlename: electorate.value.middlename,
            lastname: electorate.value.lastname,
          };
        } else {
          return {
            id: electorate.value,
            fullname: electorate.label,
            // fullname: nameParts,
          };
        }
      });

      setItems(mappedItems);
    } else {
      // Handle the case where selectedElectorates is not an array
      setItems([]);
    }
  }, [selectedWarriors_Tower, tower_id]);

  return (
    <div className="relative">
      <ul className="mt-3 divide-y divide-stone-200 border-b w-full">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 px-4 bg-gray-200 rounded mb-2 w-full"
          >
            {/* <span>{item.id} </span> */}
            <span className="text-2xl flex-grow text-gray-600">{`${
              index + 1
            }. ${
              item.fullname
                ? replaceSpecialChars(item.fullname)
                : ` ${item.precinctno} ${replaceSpecialChars(
                    item.firstname
                  )} ${replaceSpecialChars(
                    item.middlename
                  )} ${replaceSpecialChars(item.lastname)}`
            }`}</span>
          </div>
        ))}
      </ul>
      <div className=" flex justify-end">
        <p className="text-2xl">
          {`Total Team Members: `}
          <span className="font-extrabold"> {items.length}</span>
        </p>
      </div>
    </div>
  );
};

export default Listbox;
