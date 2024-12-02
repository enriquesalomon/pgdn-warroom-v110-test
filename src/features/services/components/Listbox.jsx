import React, { useState } from "react";
import { HiXMark } from "react-icons/hi2";

const Listbox = ({ selectedElectorates, selectedLeader }) => {
  const [items, setItems] = useState([]);

  // Function to remove an item by ID
  const removeItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  return (
    <div className="relative">
      <div className="flex flex-col items-center">
        <ul className="mt-3 divide-y divide-stone-200 border-b">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between w-64 py-2 px-4 bg-gray-100 rounded mb-2 "
            >
              <span>{`${item.id} - ${item.firstname} ${item.lastname}`}</span>
              <button onClick={() => removeItem(item.id)}>
                <HiXMark className="w-5 h-5 text-red-500" />
              </button>
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Listbox;
