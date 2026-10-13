// frontend/src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useEffect } from "react";
import { updateLastActive } from "../utils/behavior";   // ✅ FIXED PATH

export default function Navbar({ user }) {

  // 🔹 Update user’s lastActive every time navbar loads
  useEffect(() => {
    updateLastActive();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="w-full bg-white/70 backdrop-blur-md shadow-md p-4 flex justify-between items-center">
      <h2 className="text-xl font-bold text-gray-700">Dashboard</h2>

      <div className="flex items-center gap-4">
        <span className="font-medium text-gray-700">
          {user.displayName || user.email}
        </span>
        <Link
          to="/profile"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
     >
      Profile
     </Link>


        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

