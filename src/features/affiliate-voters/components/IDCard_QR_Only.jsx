import React, { useRef, useState, useEffect } from "react";
import QRCode from "qrcode.react";
import html2canvas from "html2canvas";
import styled, { keyframes } from "styled-components";

const companyLogo = "/logo_id.png";

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
  const { lastname, firstname, middlename, qr_code } = electorate;

  const fullName = `${firstname} ${middlename} ${lastname}`;
  const cardRef = useRef(null);

  // State to manage delay
  const [showCard, setShowCard] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCard(true);
    }, 1000); // 2000ms = 2 seconds

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
      a.download = `${fullName}_QR_card.png`;
      a.click();
    });
  };

  const handlePrint = () => {
    window.print();
  };
  return (
    <>
      {!showCard ? (
        <div className="w-[200px] h-[200px] mx-auto flex items-center justify-center">
          {/* <div class="border border-gray-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
            <div class="animate-pulse flex space-x-4">
              <div class=" bg-slate-200 h-10 w-10"></div>
              <div class="flex-1 space-y-6 py-1">
                <div class="h-2 bg-slate-200 rounded"></div>
                <div class="space-y-3">
                  <div class="grid grid-cols-3 gap-4">
                    <div class="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div class="h-2 bg-slate-200 rounded col-span-1"></div>
                  </div>
                  <div class="h-2 bg-slate-200 rounded"></div>
                </div>
              </div>
            </div>
          </div> */}
          <LoadingText>
            Generating QR
            <Dots>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </Dots>
          </LoadingText>
        </div>
      ) : (
        <div
          ref={cardRef}
          className="w-[2in] h-[3in] mx-auto bg-white rounded-lg border-2 flex flex-col items-center justify-center p-2"
        >
          <h2 className="text-2xl font-semibold text-gray-800 text-center mt-4">
            EPS
          </h2>
          {qr_code && (
            <div className="mt-4">
              <QRCode value={qr_code} size={128} />
            </div>
          )}
          <h2
            className="text-2xl font-semibold text-gray-800 text-center mt-4 "
            // style={{ textDecoration: "underline" }}
          >
            {fullName}
          </h2>
          {/* Download Button */}
          <div className="absolute top-2 left-2">
            <button
              onClick={handleDownload}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Download
            </button>
            <button
              onClick={handlePrint}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Print
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default IDCard;
