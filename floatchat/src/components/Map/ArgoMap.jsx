import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useState } from "react";
import { getNearbyFloats } from "../../api/dataApi";
import "leaflet/dist/leaflet.css";

export default function ArgoMap() {
  const [floats, setFloats] = useState([]);

  useEffect(() => {
    getNearbyFloats(10, 70).then(setFloats);
  }, []);

  return (
    <MapContainer center={[10, 70]} zoom={4} className="h-96">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {floats.map((f) => (
        <Marker
          key={f.id}
          position={[f.latitude, f.longitude]}
        >
          <Popup>
            Float: {f.float_id}<br />
            Temp: {f.temperature}°C
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
