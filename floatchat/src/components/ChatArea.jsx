import { useState, useRef, useEffect } from "react";
import { FiMenu, FiSend, FiMap } from "react-icons/fi";

export default function ChatArea({
  sidebarOpen,
  onOpenSidebar,
  mapOpen,
  onToggleMap,
}) {
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: input.trim() }]);
    setInput("");
    setLoading(true);

    // Mock async response (backend-ready)
    setTimeout(() => {
      setLoading(false);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "This is a mock response." },
      ]);
    }, 1200);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col flex-1 bg-[#f5f3ee]">
      {/* Header */}
      <div className="h-14 flex items-center px-4 gap-4 bg-[#efede6]">
        {!sidebarOpen && (
          <button
            onClick={onOpenSidebar}
            className="text-gray-700 hover:text-black cursor-pointer"
            title="Open sidebar"
          >
            <FiMenu size={20} />
          </button>
        )}

        <h2 className="font-semibold text-sm flex-1">Float Assistant</h2>

        {/* MAP TOGGLE BUTTON */}
        <button
          onClick={onToggleMap}
          className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm text-sm hover:bg-gray-100 cursor-pointer"
        >
          <FiMap size={16} />
          <span>{mapOpen ? "Close Map" : "Map"}</span>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex ${
              m.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-black text-white rounded-br-sm"
                  : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {/* Typing Animation (PURE CSS, NO ASSETS) */}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white px-4 py-3 rounded-2xl shadow-sm flex items-center gap-1">
              <span className="dot" />
              <span className="dot delay-1" />
              <span className="dot delay-2" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area (NO BORDER, FLOATING UI) */}
      <div className="px-4 pb-4">
        <div className="flex items-end gap-2 bg-white rounded-2xl px-4 py-3 shadow-md">
          <textarea
            className="flex-1 resize-none outline-none text-sm bg-transparent max-h-32"
            rows={1}
            placeholder="Type a message…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={sendMessage}
            className="text-black hover:text-gray-600 cursor-pointer"
            title="Send"
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>

      {/* Inline CSS for typing animation */}
      <style>
        {`
          .dot {
            width: 6px;
            height: 6px;
            background: #555;
            border-radius: 50%;
            animation: blink 1.4s infinite both;
          }
          .delay-1 {
            animation-delay: 0.2s;
          }
          .delay-2 {
            animation-delay: 0.4s;
          }
          @keyframes blink {
            0% { opacity: 0.2; }
            20% { opacity: 1; }
            100% { opacity: 0.2; }
          }
        `}
      </style>
    </div>
  );
}
