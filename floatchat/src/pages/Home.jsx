import { useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import MapPanel from "../components/MapPanel";

export default function Home({ user, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mapOpen, setMapOpen] = useState(true);
  const [mapWidth, setMapWidth] = useState(420); // px

  return (
    <div className="h-screen flex bg-[#efede6] overflow-hidden">
      {/* Sidebar */}
      {sidebarOpen && (
        <Sidebar
          user={user}
          onLogout={onLogout}
          onClose={() => setSidebarOpen(false)}
        />
      )}

      {/* Main area */}
      <div className="flex flex-1">
        <ChatArea
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => setSidebarOpen(true)}
          mapOpen={mapOpen}
          onToggleMap={() => setMapOpen((v) => !v)}
        />

        {/* Map panel */}
        {mapOpen && (
          <MapPanel
            width={mapWidth}
            setWidth={setMapWidth}
            onClose={() => setMapOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
