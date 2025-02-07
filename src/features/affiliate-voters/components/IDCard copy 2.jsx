import React, { useRef, useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { supabaseUrl } from "../../../services/supabase";
import html2canvas from "html2canvas";
import styled, { keyframes } from "styled-components";

const companyLogo = "/logo_id.png";
const backgroundImage = "/id_bg.jpg";
const backgroundImage_back = "/id_bg_back.jpg";

// Keyframe animation for dots
const dotBlink = keyframes`
  0% {
    opacity: 0;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

// Styled components for the loading text
const LoadingText = styled.div`
  font-size: 22px;
  color: #333;
  display: flex;
  align-items: center;
`;

const Dots = styled.div`
  display: inline-block;
  margin-left: 5px;

  & span {
    animation: ${dotBlink} 1.4s infinite;
    font-size: 16px;
  }

  & span:nth-child(1) {
    animation-delay: 0s;
  }

  & span:nth-child(2) {
    animation-delay: 0.2s;
  }

  & span:nth-child(3) {
    animation-delay: 0.4s;
  }
`;

const IDCard = ({ electorate }) => {
  const {
    lastname,
    firstname,
    middlename,
    precinctno,
    gender,
    qr_code,
    avatar,
    completeaddress,
    contactdetails,
    emergencycontact,
  } = electorate;

  const fullName = `${firstname} ${middlename} ${lastname}`;
  const address = `${completeaddress}`;
  const pic = `${supabaseUrl}/storage/v1/object/public/${avatar}`;

  const cardRef = useRef(null);
  const backCardRef = useRef(null);

  // State to manage delay
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    // Set a delay before displaying the ID card
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 2000); // 2000ms = 2 seconds

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = () => {
    if (!cardRef.current) return;

    html2canvas(cardRef.current, {
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      const url = canvas.toDataURL();
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fullName}_front.png`;
      a.click();
    });

    if (!backCardRef.current) return;

    html2canvas(backCardRef.current, {
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      const url = canvas.toDataURL();
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fullName}_back.png`;
      a.click();
    });
  };

  return (
    <>
      {!showCard ? (
        <div className="w-[300px] h-[500px] mx-auto flex items-center justify-center">
          <LoadingText>
            Generating ID card
            <Dots>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </Dots>
          </LoadingText>
        </div>
      ) : (
        <>
          {/* Front of ID Card */}
          <div
            ref={cardRef}
            className="w-[500px] h-[300px] p-2  mx-auto"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "contain", // Make the image fit the card
              backgroundPosition: "center", // Center the image within the card
              backgroundRepeat: "no-repeat", // Prevent the image from repeating
            }}
          >
            <div className="grid grid-cols-3 grid-rows-7 gap-1 h-full">
              <div className="col-span-3 row-span-2 p-1 text-center">
                {/* First Row (Spans all 3 columns) */}
              </div>

              <div className="row-span-5 p-1 flex items-center justify-center">
                <img
                  src={pic}
                  alt="User"
                  className="h-[125px] w-[125px] rounded-lg ml-8 mb-8"
                />
              </div>

              <div className="grid grid-rows-5 gap-1">
                <div className=" mb-4 text-center text-lg pt-6">{lastname}</div>
                <div className=" mb-4 text-center text-lg pt-14 mt-1">
                  {firstname}
                </div>
                <div className=" mb-4 text-center text-lg pt-24 mt-0">
                  {middlename}{" "}
                </div>
                <div className=" mb-4 text-center pt-24 text-lg mt-8">
                  {gender}
                </div>
                <div className=" mb-4 text-center text-lg pt-24 mt-16">
                  {completeaddress}{" "}
                </div>
                {/*  <div className="bg-yellow-400 mb-4 text-center">
                  Row 4 inside 2nd Column
                </div>
                <div className="bg-yellow-400 mb-4 text-center">
                  Row 5 inside 2nd Column
                </div> */}
              </div>

              <div className="grid grid-rows-3 gap-1  p-1">
                <div className=" p-1 text-center mt-2 text-lg">
                  {/* Row 1 inside 3rd Column */}
                  {precinctno}
                </div>
                <div className="p-1 text-center">
                  {/* Row 2 inside 3rd Column */}
                </div>
                <div className="row-span-2 mt-12 pt-5 ">
                  {qr_code && (
                    <div className="ml-2 h-[120px] w-[120px]">
                      <QRCode value={qr_code} size={120} />
                    </div>
                  )}
                </div>
              </div>

              <div className="col-span-3 p-1 text-center">
                {/* Seventh Row (Spans all 3 columns) */}
              </div>
            </div>
          </div>

          {/* Back of ID Card */}
          <div
            ref={backCardRef}
            className="w-[500px] h-[300px] mx-auto bg-white rounded-lg overflow-hidden  relative mt-8"
            style={{
              backgroundImage: `url(${backgroundImage_back})`,
              backgroundSize: "contain", // Make the image fit the card
              backgroundPosition: "center", // Center the image within the card
              backgroundRepeat: "no-repeat", // Prevent the image from repeating
            }}
          ></div>

          {/* Download Button */}
          <div className="absolute top-2 left-2">
            <button
              onClick={handleDownload}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Download
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default IDCard;
// import React, { useRef } from "react";
// import QRCode from "qrcode.react";
// import { supabaseUrl } from "../../../services/supabase"; // Replace with your background image path
// import html2canvas from "html2canvas";
// // import Barcode from "react-barcode";

// const companyLogo = "/logo_id.png";
// const backgroundImage = "/id_bg.png";
// const backgroundImage_back = "/id_bg_back.png";
// // THIS WILL BE USED IN BUILDING AND PACKAGING TO ELECTRON APP
// // const companyLogo = "./logo_id.png";
// // const backgroundImage = "./id_bg.png";
// // const backgroundImage_back = "./id_bg_back.png";

// const IDCard = ({ electorate }) => {
//   console.log("id card electorate", JSON.stringify(electorate));
//   const {
//     lastname,
//     firstname,
//     middlename,
//     qr_code,
//     avatar,
//     completeaddress,
//     contactdetails,
//     emergencycontact,
//   } = electorate;

//   const fullName = `${firstname} ${middlename} ${lastname}`;
//   const address = `${completeaddress}`;
//   const pic = `${supabaseUrl}/storage/v1/object/public/${avatar}`;

//   const cardRef = useRef(null);
//   const backCardRef = useRef(null);

//   const handleDownload = () => {
//     if (!cardRef.current) return;

//     html2canvas(cardRef.current, {
//       useCORS: true,
//       allowTaint: true,
//     }).then((canvas) => {
//       const url = canvas.toDataURL();
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${fullName}_front.png`;
//       a.click();
//     });

//     if (!backCardRef.current) return;

//     html2canvas(backCardRef.current, {
//       useCORS: true,
//       allowTaint: true,
//     }).then((canvas) => {
//       const url = canvas.toDataURL();
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `${fullName}_back.png`;
//       a.click();
//     });
//   };

//   return (
//     <>
//       {/* Front of ID Card */}
//       <div
//         ref={cardRef}
//         className="w-[300px] h-[500px] mx-auto bg-white shadow-md rounded-lg overflow-hidden border-2 border-orange-400 relative"
//         style={{
//           backgroundImage: `url(${backgroundImage})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div className="px-6 py-4 flex items-center justify-center relative z-20">
//           <img
//             src={companyLogo}
//             alt="Company Logo"
//             className="h-18 w-auto relative z-10"
//           />
//         </div>

//         <div className="px-6 py-4 flex items-center flex-col">
//           <div className="flex items-center">
//             <div className="relative">
//               <img
//                 src={pic}
//                 alt="User"
//                 className="h-[120px] w-[120px] rounded-lg border-2 border-orange-400" // Fixed dimensions for image
//               />
//               <div
//                 className="absolute top-0 left-0 h-full w-full border-2 border-orange-400 rounded-lg"
//                 style={{
//                   clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
//                 }}
//               ></div>
//             </div>

//             {qr_code && (
//               <div className="ml-4 h-[120px] w-[120px]">
//                 <QRCode value={qr_code} size={120} />
//               </div>
//             )}
//           </div>

//           <div className="mt-2 pt-8  pb-16">
//             <h2 className="text-4xl font-semibold text-gray-800 text-center">
//               {fullName}
//             </h2>
//             <p className="text-center text-lg text-gray-600">
//               {address === "null" ? "" : address}
//             </p>
//           </div>
//         </div>

//         <div className="bg-gray-200 px-6 py-4 text-center absolute bottom-0 left-0 right-0">
//           <p className="text-xs text-gray-600">
//             This ID card is the property of Asenso Pagadian. Unauthorized use is
//             prohibited.
//           </p>
//         </div>
//       </div>

//       {/* Back of ID Card */}
//       <div
//         ref={backCardRef}
//         className="w-[300px] h-[500px] mx-auto bg-white shadow-md rounded-lg overflow-hidden border-2 border-orange-400 relative mt-8"
//         style={{
//           backgroundImage: `url(${backgroundImage_back})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center",
//         }}
//       >
//         <div className="px-6 py-4 flex justify-center">
//           <img
//             src={companyLogo}
//             alt="Company Logo"
//             className="mt-4 h-24 w-auto"
//           />
//         </div>

//         <div className="px-6 py-4">
//           <h2 className="text-base font-semibold text-gray-800 mb-2 ">
//             Emergency Contact
//           </h2>
//           <div className="border border-gray-400 rounded-lg p-4 ">
//             <p className="text-gray-600">{emergencycontact}</p>
//           </div>
//         </div>

//         <div className="px-6 py-4">
//           <h2 className="text-base font-semibold text-gray-800 mb-2">
//             Contact Details
//           </h2>
//           <div className="border border-gray-400 rounded-lg p-4">
//             <p className="text-gray-600">{contactdetails}</p>
//           </div>
//         </div>

//         <div className="px-6 py-4">
//           <h2 className="text-base font-semibold text-gray-800 mb-2">
//             Signature
//           </h2>
//           <div className="border border-gray-400 rounded-lg p-12">
//             <p className="text-gray-600"></p>
//           </div>
//         </div>

//         <div className="bg-gray-200 px-6 py-4 text-center absolute bottom-0 left-0 right-0">
//           <p className="text-xs text-gray-600">
//             This ID card is the property of Asenso Pagadian. Unauthorized use is
//             prohibited.
//           </p>
//         </div>
//       </div>

//       {/* Download Button */}
//       <div className="absolute top-2 left-2">
//         <button
//           onClick={handleDownload}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         >
//           Download
//         </button>
//       </div>
//     </>
//   );
// };

// export default IDCard;
