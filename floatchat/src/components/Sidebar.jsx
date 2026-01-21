import { FiLogOut, FiMessageSquare, FiUser, FiX } from "react-icons/fi";
import { HiOutlineCubeTransparent } from "react-icons/hi";

export default function Sidebar({ user, onLogout, onClose }) {
  return (
    <div className="bg-white flex flex-col p-4 w-64">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-black text-white flex items-center justify-center text-lg font-bold cursor-pointer">
            <HiOutlineCubeTransparent size={18} />
          </div>
          <div className="leading-tight cursor-pointer">
            <p className="font-semibold text-sm">Float Chat</p>
            <p className="text-xs text-gray-500">Ocean Data Assistant</p>
          </div>
        </div>

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="cursor-pointer text-gray-600 hover:text-black"
          title="Close sidebar"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* Navigation */}
      <button className="bg-black text-white rounded-lg py-3 px-4 mb-auto flex items-center gap-3 cursor-pointer">
        <FiMessageSquare size={18} />
        <span>Chatbot Tab</span>
      </button>

      {/* User Section */}
      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center gap-3 mb-3 cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
            <FiUser size={18} className="text-gray-600" />
          </div>

          <div className="leading-tight">
            <p className="text-sm font-semibold">{user.username || "User"}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 ml-2 text-sm text-gray-700 hover:text-black cursor-pointer"
        >
          <FiLogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
}
