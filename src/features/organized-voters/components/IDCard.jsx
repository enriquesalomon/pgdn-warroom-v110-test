import React, { useRef, useState, useEffect } from "react";
import QRCode from "qrcode.react";
import { supabaseUrl } from "../../../services/supabase";
import html2canvas from "html2canvas";
import styled, { keyframes } from "styled-components";
import { format } from "date-fns";

const companyLogo = "/logo_id.png";
const front_template = "/id_bg.jpg";
const back_template = "/id_bg_back.jpg";

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
    id,
    lastname,
    firstname,
    middlename,
    precinctno,
    gender,
    qr_code,
    avatar,
    completeaddress,
    birthdate,
    isleader,
    brgy,
    purok,
    image,
    contactdetails,
    emergencycontact,
  } = electorate;
  console.log("isleader adw", JSON.stringify(electorate));

  const fullName = `${firstname} ${middlename} ${lastname}`;
  const address = `${completeaddress}`;
  const prk_brgy = `${purok}, ${brgy}`;
  const id_num = `SAM${id}`;
  const pic = `${image}`;
  const cardRef = useRef(null);
  const backCardRef = useRef(null);
  let classification_text;
  if (isleader !== null) {
    classification_text = "LEADER";
  } else {
    classification_text = "MEMBER";
  }
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
          <div className="w-[500px] h-[300px] mx-auto ">
            <div
              ref={cardRef}
              style={{
                backgroundImage: `url(${front_template})`,
                backgroundSize: "cover", // Change from "contain" to "cover"
                backgroundPosition: "center", // Center the image within the card
                backgroundRepeat: "no-repeat", // Prevent the image from repeating
              }}
              className="grid grid-cols-3 grid-rows-7 h-full"
            >
              <div className="col-span-3 row-span-2 p-1 text-center">
                {/* First Row (Spans all 3 columns) */}
              </div>

              <div className="flex flex-col items-center justify-center mt-32">
                <div className="">
                  <div className="">
                    <span className="text-lg ml-8">
                      {/* {format(new Date(birthdate), "MMMM dd, yyyy")} */}
                    </span>
                  </div>
                </div>
                <div className="mt-2">
                  <img
                    src={pic}
                    alt="User"
                    className="h-[121px] w-[122px] ml-9"
                  />
                </div>
              </div>
              <div className="grid grid-rows-5 gap-1">
                <div className=" mb-4 text-center text-lg pt-6">{lastname}</div>
                <div className=" mb-4 text-center text-lg pt-14 mt-2">
                  {firstname}
                </div>
                <div className=" mb-4 text-center text-lg pt-24 mt-4">
                  {middlename}{" "}
                </div>
                <div className=" mb-4 text-center pt-24 text-lg mt-14">
                  {gender}
                </div>
                <div className="mb-4 text-sm  text-center pt-24 mt-24 ml-7">
                  <span className="mt-2 text-wrap">{prk_brgy}</span>
                </div>
                <div className=" mb-4 text-center text-lg pt-24 mt-24">
                  {/* <div className="mt-16">{precinctno}</div> */}
                </div>
                {/*  <div className="bg-yellow-400 mb-4 text-center">
                  Row 4 inside 2nd Column
                </div>
                <div className="bg-yellow-400 mb-4 text-center">
                  Row 5 inside 2nd Column
                </div> */}
              </div>

              <div className="grid grid-rows-3 gap-1  p-1">
                <div className="text-center mt-3 text-lg">{precinctno}</div>
                <div className=" text-center mt-9 text-lg ">{id_num}</div>
                <div className="row-span-2 mt-11 pt-5">
                  {qr_code && (
                    // <div className="h-[2px] w-[2px]">
                    <QRCode value={qr_code} />
                    // </div>
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
            className="w-[500px] h-[300px] mx-auto overflow-hidden  relative mt-8 "
            style={{
              backgroundImage: `url(${back_template})`,
              backgroundSize: "cover",
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
