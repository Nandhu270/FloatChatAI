import { useState } from "react";
import { sendChatMessage } from "../../api/chatApi";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

export default function ChatBox() {
  const [messages, setMessages] = useState([]);

  const handleSend = async (text) => {
    setMessages((prev) => [...prev, { role: "user", text }]);

    try {
      const res = await sendChatMessage(text);

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: res.answer },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Server error. Check backend." },
      ]);
    }
  };

  return (
    <div>
      <div className="h-96 overflow-y-auto mb-4">
        {messages.map((m, i) => (
          <ChatMessage key={i} {...m} />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}
