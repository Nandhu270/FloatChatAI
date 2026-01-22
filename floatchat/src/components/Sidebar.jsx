import { FiLogOut, FiMessageSquare, FiUser, FiX } from "react-icons/fi";
import { HiOutlineCubeTransparent } from "react-icons/hi";

export default function Sidebar({ user, onLogout, onClose }) {
  return (
    <div className="bg-white flex flex-col p-4 w-64">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3 cursor-pointer">
          <div className="h-10 w-10 rounded-xl bg-black text-white flex items-center justify-center">
            <HiOutlineCubeTransparent size={18} />
          </div>
          <div>
            <p className="font-semibold text-sm">Float Chat</p>
            <p className="text-xs text-gray-500">Ocean Data Assistant</p>
          </div>
        </div>
        <button onClick={onClose} className="cursor-pointer">
          <FiX size={18} />
        </button>
      </div>

      <button className="bg-black cursor-pointer text-white rounded-lg py-3 px-4 mb-auto flex items-center gap-3">
        <FiMessageSquare size={18} />
        Chatbot Tab
      </button>

      <div className="mt-6 pt-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 cursor-pointer rounded-full bg-gray-200 flex items-center justify-center">
            <FiUser size={18} />
          </div>
          <div>
            <p className="text-sm font-semibold cursor-pointer">
              {user.username || "User"}
            </p>
            <p className="text-xs text-gray-500 cursor-pointer">{user.email}</p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex ml-2 items-center gap-2 text-sm cursor-pointer"
        >
          <FiLogOut size={16} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
