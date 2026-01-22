import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* ---------- Fix Leaflet resize ---------- */
function ResizeFix() {
  const map = useMap();
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 60);
    return () => clearTimeout(t);
  });
  return null;
}

/* ---------- Map click ---------- */
function MapClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });
  return null;
}

/* ---------- SlLocationPin-style SVG ---------- */
const slLocationPinIcon = L.divIcon({
  className: "",
  html: `
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C8.7 2 6 4.7 6 8c0 4.4 6 12 6 12s6-7.6 6-12c0-3.3-2.7-6-6-6z"
        stroke="#111"
        stroke-width="1.8"
        fill="none"
      />
      <circle cx="12" cy="8" r="2.5" fill="#111"/>
    </svg>
  `,
  iconSize: [28, 28],
  iconAnchor: [14, 28], // bottom center
});

export default function MapPanel({
  selectedLocation,
  onSelectLocation,
}) {
  const [tooltipOpen, setTooltipOpen] = useState(true);

  useEffect(() => {
    if (selectedLocation) setTooltipOpen(true);
  }, [selectedLocation]);

  return (
    <div className="bg-white flex flex-col h-full">
      <div className="h-12 shrink-0 flex items-center px-3 bg-[#efede6]">
        <span className="text-sm font-medium">Map View</span>
      </div>

      <div className="flex-1 min-h-0">
        <MapContainer
          center={[20, 78]}
          zoom={4}
          className="h-full w-full"
        >
          <ResizeFix />
          <MapClickHandler onSelect={onSelectLocation} />

          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {selectedLocation && (
            <Marker
              position={[
                selectedLocation.lat,
                selectedLocation.lng,
              ]}
              icon={slLocationPinIcon}
            >
              {tooltipOpen && (
                <Tooltip
                  permanent
                  direction="top"
                  offset={[0, -26]}   // 🔑 NO SPACE
                  opacity={1}
                  interactive
                  className="latlon-tooltip"
                >
                  <div
                    className="tooltip-bubble"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>
                      Lat: {selectedLocation.lat.toFixed(4)}, Lon:{" "}
                      {selectedLocation.lng.toFixed(4)}
                    </span>
                    <button
                      className="tooltip-close"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setTooltipOpen(false);
                      }}
                    >
                      ×
                    </button>
                  </div>
                </Tooltip>
              )}
            </Marker>
          )}
        </MapContainer>
      </div>

      {/* ---------- Tooltip styles ---------- */}
      <style>
        {`
          .latlon-tooltip {
            background: transparent;
            border: none;
            box-shadow: none;
            padding: 0;
            margin: 0;
          }

          .latlon-tooltip::before {
            display: none;
          }

          .tooltip-bubble {
            background: white;
            padding: 6px 12px;
            border-radius: 14px;
            font-size: 13px;
            font-weight: 500;
            color: #111;
            display: flex;
            align-items: center;
            gap: 10px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.18);
            white-space: nowrap;
          }

          .tooltip-close {
            border: none;
            background: none;
            font-size: 16px;
            cursor: pointer;
            line-height: 1;
            color: #666;
          }

          .tooltip-close:hover {
            color: #000;
          }
        `}
      </style>
    </div>
  );
}
