import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import MapPanel from "../components/MapPanel";

export default function Home({ user, onLogout }) {
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapOpen, setMapOpen] = useState(true);
  const [mapWidth, setMapWidth] = useState(420);

  // ✅ NEW: shared location state
  const [selectedLocation, setSelectedLocation] = useState(null);
  // { lat: number, lng: number }

  const MAP_MIN = 280;
  const MAP_MAX = Math.min(window.innerWidth * 0.75, 900);

  useEffect(() => {
    const onMove = (e) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = rect.right - e.clientX;
      if (newWidth >= MAP_MIN && newWidth <= MAP_MAX) {
        setMapWidth(newWidth);
      }
    };

    const onUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  const startDrag = () => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  return (
    <div className="h-screen flex bg-[#efede6] overflow-hidden">
      {sidebarOpen && (
        <Sidebar
          user={user}
          onLogout={onLogout}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      <div ref={containerRef} className="flex flex-1 relative min-h-0">
        {/* Chat */}
        <div className="flex-1 min-h-0">
          <ChatArea
            sidebarOpen={sidebarOpen}
            onOpenSidebar={() => setSidebarOpen(true)}
            mapOpen={mapOpen}
            onToggleMap={() => setMapOpen((v) => !v)}
            selectedLocation={selectedLocation} // 👈 pass down
          />
        </div>

        {/* Divider */}
        {mapOpen && (
          <div
            onMouseDown={startDrag}
            className="w-2 cursor-col-resize bg-transparent hover:bg-gray-300/40 z-10"
          />
        )}

        {/* Map */}
        {mapOpen && (
          <div className="min-h-0" style={{ width: mapWidth }}>
            <MapPanel
              selectedLocation={selectedLocation}
              onSelectLocation={setSelectedLocation} // 👈 callback
            />
          </div>
        )}
      </div>
    </div>
  );
}
