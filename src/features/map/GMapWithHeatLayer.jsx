import React from "react";
// import { MapContainer } from "https://cdn.esm.sh/react-leaflet/MapContainer";
// import { TileLayer } from "https://cdn.esm.sh/react-leaflet/TileLayer";
// import { useMap } from "https://cdn.esm.sh/react-leaflet/hooks";
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
import { useNavigate } from "react-router-dom";
import BrgyData from "./BrgyData";
import DashboardFilter from "../kamada-old/components/DashboardFilter";
import Row from "../../ui/Row";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const heatmapData = [
  // [7.750463468102436, 123.107151135552, 0.8], // Barangay Bogayo
  // [7.729511616898023, 123.10368116113348, 0.7], // Barangay Bolisong
  // [7.744556068345122, 123.17359239824441, 0.9], // Barangay Boyugan East
  // [7.746498639524533, 123.15279169348811, 0.6], // Barangay Poblacion
  [7.771660802229996, 123.18578248211624, 0.7], // Barangay Boyugan West
  // [7.71803964180031, 123.15124293580988, 0.5], // Barangay Bualan
  // [7.78275812591035, 123.1128026965348, 0.8], // Barangay Diplo
  // [7.748457367393536, 123.12916111121476, 0.6], // Barangay Gawil
  // [7.715566269047766, 123.10392087655404, 0.6], // Barangay Gusom
  [7.803252842296673, 123.17136539455296, 0.8], // Barangay Limamawan
  // [7.815701455666004, 123.10157320702136, 0.8], // Barangay Pangi
  // [7.769045060885373, 123.10619269375053, 0.8], // Barangay Picanan
  [7.765968787877704, 123.17089828635233, 0.8], // Barangay Secade
  // [7.831737950124906, 123.13384377364999, 0.9], // Barangay Suminalum
  // [7.803616179999863, 123.14001577074447, 0.7], // Barangay Mahayahay
  // [7.820012136498853, 123.11155974689704, 0.5], // Barangay Salagmanok
  [7.814196464470596, 123.15545102629285, 0.8], // Barangay Kitaan Dagat
  [7.782702802232105, 123.16320325459986, 0.7], // Barangay Lantawan
];

const radius = 65;
const blur = 25;
const HeatLayer = ({ data }) => {
  const map = useMap();

  React.useEffect(() => {
    const heatLayer = L.heatLayer(data, {
      radius: radius,
      blur: blur,
      maxZoom: 10,
    });

    heatLayer.addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, data]);

  return null;
};
const center = [7.7496654397536044, 123.1415123040945];
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

const boyugan_west = [
  [7.7605152, 123.1827296],
  [7.7644272, 123.1974067],
  [7.7697849, 123.1981791],
  [7.7742922, 123.19775],
  [7.7803301, 123.19775],
  [7.7895994, 123.1976642],
  [7.7920655, 123.19775],
  [7.7917254, 123.1894244],
  [7.7917254, 123.1868495],
  [7.79079, 123.1845321],
  [7.7902797, 123.181528],
  [7.7900246, 123.1801547],
  [7.7855175, 123.1796397],
  [7.782286, 123.1788672],
  [7.7792246, 123.1787814],
  [7.7769285, 123.1790389],
  [7.775908, 123.1776656],
  [7.771911, 123.1780089],
  [7.7702952, 123.1780089],
  [7.7687644, 123.1780089],
  [7.7662131, 123.1774081],
  [7.7641721, 123.1786956],
  [7.7638319, 123.1808413],
  [7.7632366, 123.1822146],
  [7.7623011, 123.1824721],
  [7.7605152, 123.1827296],
];

const secade = [
  [7.7829772, 123.1788806],
  [7.7807662, 123.1718425],
  [7.7800858, 123.1687526],
  [7.7786402, 123.167551],
  [7.7737928, 123.1630878],
  [7.7706462, 123.1591395],
  [7.7663941, 123.1556205],
  [7.7599307, 123.151329],
  [7.7572093, 123.1511573],
  [7.7594205, 123.1807689],
  [7.7605152, 123.1827296],
  [7.7632366, 123.1822146],
  [7.7638319, 123.1808413],
  [7.7641721, 123.1786956],
  [7.7662131, 123.1774081],
  [7.7687644, 123.1780089],
  [7.771911, 123.1780089],
  [7.775908, 123.1776656],
  [7.7769285, 123.1790389],
  [7.7808512, 123.1787089],
  [7.7829772, 123.1788806],
];
const lantawan = [
  [7.7900246, 123.1801547],
  [7.791071, 123.1803505],
  [7.8005527, 123.1550519],
  [7.7609238, 123.1511037],
  [7.7599307, 123.151329],
  [7.7613814, 123.1522882],
  [7.767916, 123.1567763],
  [7.7706462, 123.1591395],
  [7.7737928, 123.1630878],
  [7.7779504, 123.1669207],
  [7.7800858, 123.1687526],
  [7.7807662, 123.1718425],
  [7.7829772, 123.1788806],
  [7.7855175, 123.1796397],
  [7.7900246, 123.1801547],
];

const limamawan = [
  [7.7918539, 123.1924613],
  [7.8261666, 123.1706506],
  [7.8005527, 123.1550519],
  [7.791071, 123.1803505],
  [7.7900246, 123.1801547],
  [7.7906656, 123.1839835],
  [7.7917254, 123.1868495],
  [7.7918539, 123.1924613],
];

const kitaan_dagat = [
  [7.8153334, 123.1639784],
  [7.8261666, 123.1706506],
  [7.8301172, 123.1577864],
  [7.8318552, 123.1558994],
  [7.8321422, 123.1543974],
  [7.8335133, 123.1528954],
  [7.8003078, 123.149505],
  [7.8005527, 123.1550519],
];

const mahayahay = [
  [7.8187006, 123.1513891],
  [7.816953, 123.1306727],
  [7.8064087, 123.1311018],
  [7.797735, 123.13505],
  [7.7934832, 123.1354792],
  [7.7959493, 123.1407149],
  [7.7970547, 123.1451781],
  [7.7992657, 123.1468947],
  [7.8003078, 123.149505],
  [7.8187006, 123.1513891],
];
// Style the Popup
const StyledPopup = styled.div`
  max-width: 300px;
  padding: 1px;
  /* border: 1px solid #ccc; */
  /* border-radius: 8px; */
  background-color: white;
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2); */

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
const fillGreenOptions = { fillColor: "green" };
const blackOptions = { color: "#E6D9A2" };
const limeOptions = { color: "lime" };
const purpleOptions = { color: "purple" };
const redOptions = { color: "red" };

function GMap() {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Go back to the previous page
  };
  return (
    <div style={{ position: "relative" }}>
      {/* Back Button */}
      <Row type="horizontal">
        <DashboardFilter />
      </Row>
      <BackButton onClick={goBack}>
        <IoMdArrowRoundBack />
      </BackButton>
      <MapContainer center={center} zoom={13} maxZoom={13}>
        <HeatLayer data={heatmapData} />
        {/* <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      /> */}

        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.carto.com/attributions">CARTO</a>'
        />
        <Polygon pathOptions={blackOptions} positions={boyugan_west}>
          {/* <Popup>BOYUGAN WEST</Popup> */}
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            BOYUGAN WEST
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="BOYUGAN WEST" />
            </StyledPopup>
          </Popup>
        </Polygon>
        <Polygon pathOptions={blackOptions} positions={secade}>
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            SICADE
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="SICADE" />
            </StyledPopup>
          </Popup>
        </Polygon>
        <Polygon pathOptions={blackOptions} positions={lantawan}>
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            LANTAWAN
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="LANTAWAN" />
            </StyledPopup>
          </Popup>
        </Polygon>
        <Polygon pathOptions={blackOptions} positions={limamawan}>
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            LIMAMAWAN
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="LIMAMAWAN" />
            </StyledPopup>
          </Popup>
        </Polygon>
        <Polygon pathOptions={blackOptions} positions={kitaan_dagat}>
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            KITAAN DAGAT
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="KITAAN DAGAT" />
            </StyledPopup>
          </Popup>
        </Polygon>
        <Polygon pathOptions={blackOptions} positions={mahayahay}>
          <Tooltip direction="center" offset={[0, 20]} opacity={1} permanent>
            MAHAYAHAY
          </Tooltip>
          <Popup>
            <StyledPopup>
              <BrgyData brgy="MAHAYAHAY" />
            </StyledPopup>
          </Popup>
        </Polygon>
      </MapContainer>
    </div>
  );
}

export default GMap;
