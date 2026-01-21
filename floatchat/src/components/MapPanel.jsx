import { useRef, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapPanel({ width, setWidth, onClose }) {
  const isResizing = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;

      // Calculate width from right edge
      const newWidth = window.innerWidth - e.clientX;

      // Clamp width
      if (newWidth >= 280 && newWidth <= 720) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = "default";
        document.body.style.userSelect = "auto";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setWidth]);

  const startResize = () => {
    isResizing.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  return (
    <div
      className="relative bg-white flex flex-col border-l"
      style={{ width }}
    >
      {/* RESIZE HANDLE (VISIBLE + USABLE) */}
      <div
        onMouseDown={startResize}
        className="absolute left-0 top-0 h-full w-2 cursor-col-resize bg-transparent hover:bg-gray-300/40"
        title="Drag to resize"
      />

      {/* Header */}
      <div className="h-12 flex items-center justify-between px-3 bg-[#efede6]">
        <span className="text-sm font-medium">Map View</span>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-black cursor-pointer"
          title="Close map"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* Map */}
      <div className="flex-1">
        <MapContainer
          center={[20, 78]}
          zoom={4}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        </MapContainer>
      </div>
    </div>
  );
}
