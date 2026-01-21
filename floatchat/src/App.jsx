// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Chatbot from "./pages/Chatbot";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<Chatbot />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }



import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { getSession, clearSession } from "./utils/authStore";
import Loader from "./components/Loader";

export default function App() {
  const [page, setPage] = useState("login"); // login | signup | home
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Simulate async session check (like real apps)
    const session = getSession();

    setTimeout(() => {
      if (session) {
        setUser(session);
        setPage("home");
      }
      setAuthLoading(false);
    }, 800); // smooth UX delay
  }, []);

  if (authLoading) {
    return <Loader />;
  }

  if (page === "home") {
    return (
      <Home
        user={user}
        onLogout={() => {
          clearSession();
          setUser(null);
          setPage("login");
        }}
      />
    );
  }

  if (page === "signup") {
    return <Signup onSignin={() => setPage("login")} />;
  }

  return (
    <Login
      onLogin={(u) => {
        setUser(u);
        setPage("home");
      }}
      onSignup={() => setPage("signup")}
    />
  );
}
