export default function Loader() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#efede6]">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="bg-black text-white rounded-lg px-3 py-2 font-bold text-lg">
            ≋
          </div>
          <span className="text-xl font-semibold text-black">Float Chat</span>
        </div>

        {/* SVG Spinner (NO TAILWIND DEPENDENCY) */}
        <svg className="w-6 h-6 text-black" viewBox="0 0 50 50">
          <circle
            cx="25"
            cy="25"
            r="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="28 28"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.9s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>

        {/* Text */}
        <p className="text-sm text-gray-600 tracking-wide">
          Loading your workspace…
        </p>
      </div>
    </div>
  );
}
