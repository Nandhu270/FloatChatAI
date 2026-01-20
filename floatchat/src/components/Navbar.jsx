import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-slate-900 border-b border-slate-800">
      <h1 className="text-xl font-bold">ARGO AI</h1>

      <div className="flex gap-6">
        <NavLink to="/" className="hover:text-cyan-400">Home</NavLink>
        <NavLink to="/dashboard" className="hover:text-cyan-400">Dashboard</NavLink>
        <NavLink to="/visualization" className="hover:text-cyan-400">Visualization</NavLink>
        <NavLink to="/chatbot" className="hover:text-cyan-400">Chatbot</NavLink>
      </div>
    </nav>
  );
}
