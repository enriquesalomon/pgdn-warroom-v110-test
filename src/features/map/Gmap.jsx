import React, { useEffect, useRef, useState } from "react";
import { IoMdArrowRoundBack } from "react-icons/io";
import Tag from "../../ui/Tag";
import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./GMap.css"; // Import the CSS file
import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import BrgyData from "./BrgyData";
// import DashboardFilter from "./map/components/DashboardFilter";
import Row from "../../ui/Row";
import L from "leaflet";


import {
  boyugan_west,
  secade,
  lantawan,
  limamawan,
  kitaan_dagat,
  mahayahay,
  suminalum,
  salagmanok,
  diplo,
  gawil,
  picanan,
  poblacion,
  boyugan_east,
  pangi,
  bualan,
  bogayo,
  bolisong,
  gusom,
} from "./polygons";
import RenderAllData from "./RenderAllData";
import DashboardFilter from "./DashboardFilter";

const center = [7.766297, 123.142377];
// Button styling
const BackButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #4caf50;
  color: #faf7f7;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  z-index: 1000; /* Ensure button stays on top of the map */
  &:hover {
    background-color: #45a049;
  }
`;

// Style the Popup
const StyledPopup = styled.div`
  max-width: 300px;
  padding: 1px;
  background-color: white;

  table {
    width: 100%;
    border-collapse: collapse;

    th,
    td {
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }

    th {
      background-color: #f2f2f2;
    }
  }
`;

const AddGradientOverlay = () => {
  const map = useMap();

  useEffect(() => {
    L.svg().addTo(map);
    const svg = document.querySelector(".leaflet-overlay-pane svg");

    if (svg) {
      const defs = ` 
        <defs>
          <radialGradient id="polygon-gradient" cx="40%" cy="40%" r="50%" fx="30%" fy="30%">
            <stop offset="0%" style="stop-color: #4caf50; stop-opacity: 1" />
            <stop offset="100%" style="stop-color: #4caf50; stop-opacity: 1" />
          </radialGradient>
        </defs>
      `;
      svg.innerHTML = defs + svg.innerHTML;
    }
  }, [map]);

  return null;
};

function GMap() {
  const [brgyData, setBrgyData] = useState(null);

  const [fillColors, setFillColors] = useState({
    "BOYUGAN WEST": "rgba(230, 217, 162, 0.5)",
    SICADE: "rgba(230, 217, 162, 0.5)",
    LANTAWAN: "rgba(230, 217, 162, 0.5)",
    LIMAMAWAN: "rgba(230, 217, 162, 0.5)",
    "KITAAN DAGAT": "rgba(230, 217, 162, 0.5)",
    MAHAYAHAY: "rgba(230, 217, 162, 0.5)",
    SUMINALUM: "rgba(230, 217, 162, 0.5)",
    SALAGMANOK: "rgba(230, 217, 162, 0.5)",
    DIPLO: "rgba(230, 217, 162, 0.5)",
    GAWIL: "rgba(230, 217, 162, 0.5)",
    PICANAN: "rgba(230, 217, 162, 0.5)",
    POBLACION: "rgba(230, 217, 162, 0.5)",
    "BOYUGAN EAST": "rgba(230, 217, 162, 0.5)",
    PANGI: "rgba(230, 217, 162, 0.5)",
    BUALAN: "rgba(230, 217, 162, 0.5)",
    BOGAYO: "rgba(230, 217, 162, 0.5)",
    BOLISONG: "rgba(230, 217, 162, 0.5)",
    GUSOM: "rgba(230, 217, 162, 0.5)",
  });

  const barangays = [
    "BOYUGAN WEST",
    "SICADE",
    "LANTAWAN",
    "LIMAMAWAN",
    "KITAAN DAGAT",
    "MAHAYAHAY",
    "SUMINALUM",
    "SALAGMANOK",
    "DIPLO",
    "GAWIL",
    "PICANAN",
    "POBLACION",
    "BOYUGAN EAST",
    "PANGI",
    "BUALAN",
    "BOGAYO",
    "BOLISONG",
    "GUSOM",
  ];
  const processedBarangays = useRef(new Set());
  const location = useLocation();
  const navigate = useNavigate();
  

  useEffect(() => {
    const validParams = ["1v", "2v", "3v", "Survey"];
    const searchParams = new URLSearchParams(location.search);
    const validationParam = searchParams.get("validation");

    // If no validation param exists, default to "Survey"
    if (!validationParam) {
      navigate("/gmap?validation=Survey", { replace: true });
      return;
    }

    // Get the last stored validation value
    const lastValidation = sessionStorage.getItem("lastValidation");

    if (validParams.includes(validationParam) && lastValidation !== validationParam) {
      sessionStorage.setItem("lastValidation", validationParam); // Store new validation value
      window.location.replace(location.pathname + location.search); // Reload without adding to history
    }
  }, [location, navigate]);
  const handleDataAvailable = (data) => {
    console.log("naghandle", JSON.stringify(data));
    if (processedBarangays.current.has(data.brgy)) {
      return;
    }
    processedBarangays.current.add(data.brgy);
    setBrgyData(data);

    // let newColor;

    // if (data.count_ato >= data.count_dili) {
    //   newColor = "#4caf50";
    // } else if (data.count_dili >= data.count_ato) {
    //   newColor = "#FF0000";
    // } else {
    //   newColor = "rgba(230, 217, 162, 0.5)";
    // }

    let newColor;

    console.log("dataaaax", JSON.stringify(data));
    if (data.count_ato === data.count_dili) {
      newColor = "rgba(230, 217, 162, 0.5)";
    } else {
      if (data.count_ato >= data.count_dili) {
        newColor = "#4caf50"; // Green
      } else if (data.count_dili > data.count_ato) {
        newColor = "#FF0000"; // Red
      } else {
        newColor = "rgba(230, 217, 162, 0.5)"; // Yellow
      }
    }

    setFillColors((prevColors) => ({
      ...prevColors,
      [data.brgy]: newColor,
    }));

    console.log("data: ", data, "newColor: ", newColor);
  };
 

  const goBack = () => {
    navigate("/dashboard");
  };
  

  return (
    <div style={{ position: "relative" }}>
      {/* Back Button */}
      <Row type="horizontal">
        <DashboardFilter />
        <div>
          {barangays.map((brgy) => (
            <RenderAllData
              key={brgy}
              brgy={brgy}
              onDataAvailable={handleDataAvailable}
            />
          ))}
        </div>
      </Row>
      <BackButton onClick={goBack}>
        <IoMdArrowRoundBack />
      </BackButton>
      <MapContainer center={center} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.carto.com/attributions">CARTO</a>'
        />
        <AddGradientOverlay />

        {/* Render Polygons */}
        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["BOYUGAN WEST"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={boyugan_west}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            BOYUGAN WEST
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="BOYUGAN WEST" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["SICADE"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={secade}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            SICADE
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="SICADE" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["LANTAWAN"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={lantawan}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            LANTAWAN
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="LANTAWAN" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["LIMAMAWAN"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={limamawan}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            LIMAMAWAN
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="LIMAMAWAN" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["KITAAN DAGAT"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={kitaan_dagat}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            KITAAN DAGAT
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="KITAAN DAGAT" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["MAHAYAHAY"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={mahayahay}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            MAHAYAHAY
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="MAHAYAHAY" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["SUMINALUM"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={suminalum}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            SUMINALUM
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="SUMINALUM" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["SALAGMANOK"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={salagmanok}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            SALAGMANOK
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="SALAGMANOK" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["DIPLO"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={diplo}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            DIPLO
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="DIPLO" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["GAWIL"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={gawil}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            GAWIL
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="GAWIL" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["PICANAN"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={picanan}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            PICANAN
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="PICANAN" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["POBLACION"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={poblacion}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            POBLACION
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="POBLACION" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["BOYUGAN EAST"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={boyugan_east}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            BOYUGAN EAST
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="BOYUGAN EAST" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["PANGI"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={pangi}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            PANGI
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="PANGI" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["BUALAN"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={bualan}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            BUALAN
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="BUALAN" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["BOGAYO"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={bogayo}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            BOGAYO
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="BOGAYO" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["BOLISONG"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={bolisong}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            BOLISONG
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="BOLISONG" />
            </StyledPopup>
          </Popup>
        </Polygon>

        <Polygon
          pathOptions={{
            fillOpacity: 1,
            fillColor: fillColors["GUSOM"],
            stroke: true,
            color: "white",
            weight: 1,
            opacity: 1,
          }}
          positions={gusom}
        >
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            GUSOM
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="GUSOM" />
            </StyledPopup>
          </Popup>
        </Polygon>
      </MapContainer>
    </div>
  );
}

export default GMap;
