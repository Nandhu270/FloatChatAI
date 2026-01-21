import { useState } from "react";
import { validateUser, setSession } from "../utils/authStore";

export default function Login({ onLogin, onSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault(); // ⛔ prevent page reload

    const user = validateUser(email, password);
    if (!user) {
      setError("Invalid email or password");
      return;
    }

    setSession(user);
    onLogin(user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#efede6]">
      <form
        onSubmit={submit}
        className="w-[420px] bg-white rounded-xl shadow-md p-8"
      >
        <h1 className="text-2xl font-bold text-center mb-1">
          Welcome Back
        </h1>

        <input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        {/* IMPORTANT: type="submit" */}
        <button
          type="submit"
          className="w-full bg-black text-white py-3 rounded-lg mt-2"
        >
          Sign In
        </button>

        <p className="text-center text-sm mt-4">
          Don&apos;t have an account?{" "}
          <span
            className="font-semibold cursor-pointer"
            onClick={onSignup}
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
