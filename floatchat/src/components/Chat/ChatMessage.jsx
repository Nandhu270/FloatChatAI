export default function ChatMessage({ role, text }) {
  return (
    <div className={`p-3 rounded ${role === "user" ? "bg-slate-700" : "bg-slate-800"}`}>
      {text}
    </div>
  );
}
