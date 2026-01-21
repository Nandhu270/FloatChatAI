import { useState } from "react";
import { addUser, getUsers } from "../utils/authStore";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Signup({ onSignin }) {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault(); // ⛔ prevent page reload

    if (!form.username || !form.email || !form.password) {
      setError("All fields are required");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const exists = getUsers().some(
      (u) => u.email === form.email.trim().toLowerCase()
    );
    if (exists) {
      setError("User already exists");
      return;
    }

    addUser(form);
    onSignin(); // ✅ redirect to login ONLY
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#efede6]">
      <form
        onSubmit={submit}
        className="w-[420px] bg-white rounded-xl shadow-md p-8"
      >
        <h1 className="text-2xl font-bold text-center mb-1">
          Create Account
        </h1>

        <input
          className="input"
          placeholder="Username"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
          required
        />

        <input
          className="input"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
          required
        />

        {/* Password with show/hide */}
        <div className="relative">
          <input
            className="input pr-10"
            type={showPwd ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-3 text-gray-500 cursor-pointer"
          >
            {showPwd ? <FiEyeOff /> : <FiEye />}
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {/* IMPORTANT: type="submit" */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg mt-2"
        >
          Sign Up
        </button>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <span
            className="font-semibold cursor-pointer"
            onClick={onSignin}
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
}
