// import React, { useState, useEffect } from "react";

// const Listbox = ({ selectedElectorates, tower_id }) => {
//   const [items, setItems] = useState([]);

//   selectedElectorates = selectedElectorates.filter(
//     (item) => item.value !== tower_id
//   );

//   useEffect(() => {
//     if (Array.isArray(selectedElectorates)) {
//       const mappedItems = selectedElectorates.map((electorate) => {
//         if (typeof electorate.value === "object") {
//           // Complex object
//           return {
//             id: electorate.value.id,
//             firstname: electorate.value.firstname,
//             middlename: electorate.value.middlename,
//             lastname: electorate.value.lastname,
//           };
//         } else {
//           // Simple object
//           const nameParts = electorate.label.split(" ").slice(1).join(" ");
//           return {
//             id: electorate.value,
//             fullname: nameParts,
//           };
//         }
//       });
//       setItems(mappedItems);
//     } else {
//       // Handle the case where selectedElectorates is not an array
//       setItems([]);
//     }
//   }, [selectedElectorates]);

//   return (
//     <div className="relative">
//       <ul className="mt-3 divide-y divide-stone-200 border-b w-full">
//         {items.map((item, index) => (
//           <div
//             key={item.id}
//             className="flex items-center justify-between py-2 px-4 bg-gray-200 rounded mb-2 w-full"
//           >
//             <span className="text-2xl flex-grow text-gray-600">{`${
//               index + 1
//             }. ${
//               item.fullname
//                 ? item.fullname
//                 : `${item.firstname} ${item.middlename} ${item.lastname}`
//             }`}</span>
//           </div>
//         ))}
//       </ul>
//       <div className=" flex justify-end">
//         <p className="text-2xl">
//           {`Total Team Members: `}{" "}
//           <span className="font-extrabold"> {items.length}</span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Listbox;
import React, { useState, useEffect } from "react";

const Listbox = ({ selectedElectorates, tower_id }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Avoid modifying selectedElectorates directly; filter inside useEffect
    const filteredElectorates = selectedElectorates.filter(
      (item) => item.value !== tower_id
    );

    if (Array.isArray(filteredElectorates)) {
      const mappedItems = filteredElectorates.map((electorate) => {
        if (typeof electorate.value === "object") {
          // Complex object
          return {
            id: electorate.value.id,
            firstname: electorate.value.firstname,
            middlename: electorate.value.middlename,
            lastname: electorate.value.lastname,
          };
        } else {
          // Simple object
          const nameParts = electorate.label.split(" ").slice(1).join(" ");
          return {
            id: electorate.value,
            fullname: nameParts,
          };
        }
      });
      setItems(mappedItems);
    } else {
      // Handle the case where selectedElectorates is not an array
      setItems([]);
    }
  }, [selectedElectorates, tower_id]); // Include tower_id in dependency array

  return (
    <div className="relative">
      <ul className="mt-3 divide-y divide-stone-200 border-b w-full">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 px-4 bg-gray-200 rounded mb-2 w-full"
          >
            <span className="text-2xl flex-grow text-gray-600">{`${
              index + 1
            }. ${
              item.fullname
                ? item.fullname
                : `${item.firstname} ${item.middlename} ${item.lastname}`
            }`}</span>
          </div>
        ))}
      </ul>
      <div className="flex justify-end">
        <p className="text-2xl">
          {`Total Team Members: `}
          <span className="font-extrabold"> {items.length}</span>
        </p>
      </div>
    </div>
  );
};

export default Listbox;
