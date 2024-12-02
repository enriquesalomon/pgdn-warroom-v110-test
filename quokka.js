// // First data
// const firstData = {
//   data: [
//     {
//       brgy: "BALANGASAN",
//       warriors: 40,
//       baco_count: 3,
//       gm_count: 2,
//       agm_count: 1,
//       legend_count: 3,
//       elite_count: 3,
//       jehovah_count: 2,
//       inc_count: 7,
//       ot_count: 3,
//       unvalidated_count: 9789,
//     },
//     {
//       brgy: "BANALE",
//       warriors: 20,
//       baco_count: 1,
//       gm_count: 1,
//       agm_count: 1,
//       legend_count: 1,
//       elite_count: 1,
//       jehovah_count: 1,
//       inc_count: 1,
//       ot_count: 3,
//       unvalidated_count: 5004,
//     },
//     {
//       brgy: "BOMBA",
//       warriors: 40,
//       baco_count: 1,
//       gm_count: 1,
//       agm_count: 1,
//       legend_count: 1,
//       elite_count: 1,
//       jehovah_count: 0,
//       inc_count: 0,
//       ot_count: 1,
//       unvalidated_count: 2587,
//     },
//     {
//       brgy: "BUENAVISTA",
//       warriors: 0,
//       baco_count: 0,
//       gm_count: 0,
//       agm_count: 0,
//       legend_count: 0,
//       elite_count: 0,
//       jehovah_count: 0,
//       inc_count: 0,
//       ot_count: 0,
//       unvalidated_count: 4160,
//     },
//   ],
// };

// // Second data
// const secondData = {
//   data: [
//     {
//       brgy: "BALANGASAN",
//       count: 2,
//     },
//     {
//       brgy: "BANALE",
//       count: 1,
//     },
//   ],
// };

// // Combine data
// const combinedData = firstData.data.map((item) => {
//   const match = secondData.data.find((d) => d.brgy === item.brgy);
//   return {
//     ...item,
//     total_count_scanned: match ? match.count : 0,
//   };
// });

// console.log(combinedData);

let tot_Unscanned = 8 - 7;
tot_Unscanned = Math.max(tot_Unscanned, 0);
console.log("answer:", tot_Unscanned);
