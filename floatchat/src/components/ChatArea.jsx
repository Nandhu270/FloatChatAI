import { useState, useRef, useEffect } from "react";
import { FiMenu, FiSend, FiMap } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { RiRobot2Line } from "react-icons/ri";

export default function ChatArea({
  sidebarOpen,
  onOpenSidebar,
  mapOpen,
  onToggleMap,
  selectedLocation,
}) {
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hello! How can I help you today?",
      time: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const MAX_HEIGHT = 160;

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto"; // reset first
    const newHeight = Math.min(el.scrollHeight, MAX_HEIGHT);
    el.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    if (!selectedLocation) return;

    const text = `lat ${selectedLocation.lat.toFixed(
      6,
    )}, lon ${selectedLocation.lng.toFixed(6)}`;

    setInput(text);

    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
        textareaRef.current.style.height = `${Math.min(
          textareaRef.current.scrollHeight,
          160,
        )}px`;
      }
    });
  }, [selectedLocation]);

  /* ---------------- SEND MESSAGE ---------------- */
  // const sendMessage = async () => {
  //   if (!input.trim() || loading) return;

  //   const userText = input.trim();

  //   // User message
  //   setMessages((prev) => [
  //     ...prev,
  //     {
  //       role: "user",
  //       text: userText,
  //       time: new Date(),
  //     },
  //   ]);

  //   setInput("");
  //   setLoading(true);

  //   requestAnimationFrame(() => {
  //     if (textareaRef.current) {
  //       textareaRef.current.style.height = "auto";
  //     }
  //   });

  //   try {
  //     // 🔌 BACKEND READY (mock for now)
  //     await new Promise((res) => setTimeout(res, 1200));

  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         role: "bot",
  //         text: "This is a mock response from the assistant.",
  //         time: new Date(),
  //       },
  //     ]);
  //   } catch {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         role: "bot",
  //         text: "Something went wrong. Please try again.",
  //         time: new Date(),
  //       },
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const formatBackendResponse = (data) => {
    if (!data || !data.location_status) {
      return "No data available.";
    }

    let text = "";

    text += `📍 ${data.location_status.region}\n`;
    text += `${data.location_status.description}\n\n`;

    if (data.input?.analysis_range) {
      text += `🗓 Analysis Range:\n${data.input.analysis_range}\n\n`;
    }

    if (data.ocean_data_summary?.parameters_analyzed?.length) {
      text += `🌊 Parameters Analyzed:\n`;
      data.ocean_data_summary.parameters_analyzed.forEach((p) => {
        text += `• ${p.replaceAll("_", " ")}\n`;
      });
      text += "\n";
    }

    if (data.ocean_data_summary?.key_insights?.length) {
      text += `🔍 Key Insights:\n`;
      data.ocean_data_summary.key_insights.forEach((i) => {
        text += `• ${i}\n`;
      });
      text += "\n";
    }

    if (data.data_confidence) {
      text += `📊 Data Confidence: ${data.data_confidence}`;
    }

    return text.trim();
  };

  // const sendMessage = async () => {
  //   if (!input.trim() || loading) return;

  //   const userText = input.trim();

  //   // push user message
  //   setMessages((prev) => [
  //     ...prev,
  //     {
  //       role: "user",
  //       text: userText,
  //       time: new Date(),
  //     },
  //   ]);

  //   setInput("");
  //   setLoading(true);

  //   try {
  //     // ⚠️ lat/lon handling
  //     const lat = selectedLocation?.lat;
  //     const lon = selectedLocation?.lng;

  //     if (lat === undefined || lon === undefined) {
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           role: "bot",
  //           text: "Please select a location on the map first.",
  //           time: new Date(),
  //         },
  //       ]);
  //       setLoading(false);
  //       return;
  //     }

  //     // 🔌 REAL BACKEND CALL
  //     const res = await fetch("http://localhost:8000/api/chat/", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         message: userText,
  //         lat,
  //         lon,
  //       }),
  //     });

  //     if (!res.ok) {
  //       throw new Error("Backend error");
  //     }

  //     const data = await res.json();

  //     // push bot reply
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         role: "bot",
  //         text: data.reply || "No response from server.",
  //         time: new Date(),
  //       },
  //     ]);
  //   } catch (err) {
  //     setMessages((prev) => [
  //       ...prev,
  //       {
  //         role: "bot",
  //         text: "Server error. Please try again later.",
  //         time: new Date(),
  //       },
  //     ]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();

    // push user message
    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userText,
        time: new Date(),
      },
    ]);

    setInput("");
    setLoading(true);

    try {
      const lat = selectedLocation?.lat;
      const lon = selectedLocation?.lng;

      if (lat === undefined || lon === undefined) {
        setMessages((prev) => [
          ...prev,
          {
            role: "bot",
            text: "Please select a location on the map first.",
            time: new Date(),
          },
        ]);
        setLoading(false);
        return;
      }

      // 🔌 BACKEND CALL (payload fixed)
      const res = await fetch("http://localhost:8000/api/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: lat,
          longitude: lon,
          // date: "YYYY-MM-DD" // optional later
        }),
      });

      if (!res.ok) {
        throw new Error("Backend error");
      }

      const data = await res.json();

      // ✅ FORMAT STRUCTURED RESPONSE
      const formattedText = formatBackendResponse(data);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: formattedText,
          time: new Date(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Server error. Please try again later.",
          time: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#f5f3ee]">
      {/* Header */}
      <div className="h-14 shrink-0 flex items-center px-4 gap-4 bg-[#efede6]">
        {!sidebarOpen && (
          <button onClick={onOpenSidebar} className="cursor-pointer">
            <FiMenu size={20} />
          </button>
        )}

        <h2 className="text-sm font-semibold flex-1">Float Assistant</h2>

        <button
          onClick={onToggleMap}
          className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg shadow-sm text-sm cursor-pointer"
        >
          <FiMap size={16} />
          {mapOpen ? "Close Map" : "Open Map"}
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4 space-y-6">
        {messages.map((m, idx) => {
          const isUser = m.role === "user";

          return (
            <div
              key={idx}
              className={`flex ${isUser ? "justify-end" : "justify-start"}`}
            >
              {/* BOT ICON */}
              {!isUser && (
                <div className="mr-3 mt-1">
                  <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-700">
                    <RiRobot2Line size={18} />
                  </div>
                </div>
              )}

              {/* MESSAGE + TIME */}
              <div
                className={`flex flex-col ${
                  isUser ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`px-4 py-3 rounded-2xl text-sm max-w-[420px] leading-relaxed ${
                    isUser
                      ? "bg-black text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>

                <span className="text-xs text-gray-500 mt-1">
                  {m.time.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {/* USER ICON */}
              {isUser && (
                <div className="ml-3 mt-1">
                  <div className="w-9 h-9 rounded-full bg-black text-white flex items-center justify-center">
                    <FiUser size={16} />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* TYPING INDICATOR */}
        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-gray-700">
              <RiRobot2Line size={18} />
            </div>
            <div className="bg-white px-4 py-2 rounded-2xl text-sm text-gray-600">
              AI is Thinking...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="shrink-0 px-4 pb-4">
        <div className="flex items-end gap-2 bg-white rounded-2xl px-4 py-3 shadow-md">
          <textarea
            ref={textareaRef}
            className="flex-1 resize-none outline-none text-sm bg-transparent overflow-y-auto"
            placeholder="Type a message…"
            value={input}
            rows={1}
            onChange={(e) => {
              setInput(e.target.value);
              autoResize();
            }}
            onPaste={() => {
              requestAnimationFrame(autoResize);
            }}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            className="text-black hover:text-gray-600 disabled:opacity-50 cursor-pointer"
          >
            <FiSend size={18} />
          </button>
        </div>
      </div>

      {/* Typing animation */}
      <style>
        {`
          .dot {
            width: 6px;
            height: 6px;
            background: #555;
            border-radius: 50%;
            animation: blink 1.4s infinite both;
          }
          .delay-1 { animation-delay: 0.2s; }
          .delay-2 { animation-delay: 0.4s; }
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
