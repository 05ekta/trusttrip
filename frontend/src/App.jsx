import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BuddyMatch from "./pages/BuddyMatch";
import ProfileView from "./pages/ProfileView";
import ChatWindow from "./pages/ChatWindow";
import Profile from "./pages/Profile";
import Preferences from "./pages/Preferences";
// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <Router>
      {!user ? (
        // ⛔ Only show Login & Register when logged out
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Redirect ANY other page to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        // ✅ LOGGED IN SECTION
        <>
          <Navbar user={user} />

          <div className="flex">
            <Sidebar />

            <Routes>
              <Route path="/" element={<Dashboard user={user} />} />

              {/* Buddy match */}
              <Route path="/buddy/preferences" element={<Preferences />} />
              <Route path="/buddy/matches" element={<BuddyMatch />} />


              {/* My Profile */}
              <Route path="/profile" element={<Profile />} />

              {/* View other user's profile */}
              <Route path="/profile/:uid" element={<ProfileView />} />


              {/* Chat */}
              <Route path="/chat/:uid" element={<ChatWindow />} />

              {/* future features */}
              <Route path="/sos" element={<h1 className="p-8">SOS Coming Soon</h1>} />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </>
      )}
    </Router>
  );
}
