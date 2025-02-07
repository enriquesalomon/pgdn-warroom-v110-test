// src/Heatmap.js
import React from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";

const heatmapData = [
  [7.750463468102436, 123.107151135552, 0.8], // Barangay Bogayo
  [7.729511616898023, 123.10368116113348, 0.7], // Barangay Bolisong
  [7.744556068345122, 123.17359239824441, 0.9], // Barangay Boyugan East
  [7.746498639524533, 123.15279169348811, 0.6], // Barangay Poblacion
  [7.771660802229996, 123.18578248211624, 0.7], // Barangay Boyugan West
  [7.71803964180031, 123.15124293580988, 0.5], // Barangay Bualan
  [7.78275812591035, 123.1128026965348, 0.8], // Barangay Diplo
  [7.748457367393536, 123.12916111121476, 0.6], // Barangay Gawil
  [7.715566269047766, 123.10392087655404, 0.6], // Barangay Gusom
  [7.803252842296673, 123.17136539455296, 0.8], // Barangay Limamawan
  [7.815701455666004, 123.10157320702136, 0.8], // Barangay Pangi
  [7.769045060885373, 123.10619269375053, 0.8], // Barangay Picanan
  [7.765968787877704, 123.17089828635233, 0.8], // Barangay Secade
  [7.831737950124906, 123.13384377364999, 0.9], // Barangay Suminalum
  [7.803616179999863, 123.14001577074447, 0.7], // Barangay Mahayahay
  [7.820012136498853, 123.11155974689704, 0.5], // Barangay Salagmanok
  [7.814196464470596, 123.15545102629285, 0.8], // Barangay Kitaan Dagat
  [7.782702802232105, 123.16320325459986, 0.7], // Barangay Lantawan
];

const radius = 45;
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

const Heatmap = () => {
  return (
    <MapContainer
      center={[7.7178, 123.1168]}
      zoom={12}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <HeatLayer data={heatmapData} />
    </MapContainer>
  );
};

export default Heatmap;
