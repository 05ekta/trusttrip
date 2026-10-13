// frontend/src/pages/Dashboard.jsx
import { Link } from "react-router-dom";
import { Plane, Users, MessageCircle, ShieldAlert, ListChecks } from "lucide-react";

export default function Dashboard({ user }) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">

      {/* MAIN CONTENT */}
      <main className="flex-1 bg-white/70 backdrop-blur-lg shadow-2xl rounded-3xl p-10">

        {/* HEADER */}
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
          Welcome, {user.displayName || user.email} 👋
        </h2>
        <p className="text-gray-600 text-lg">
          Let’s help you travel smarter & safer!
        </p>

        {/* FEATURE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">

          {/* 📝 Set Preferences */}
          <Link to="/buddy/preferences">
            <div className="group bg-gradient-to-r from-[#4facfe] to-[#00f2fe] p-6 rounded-2xl shadow-xl text-white cursor-pointer transform transition hover:scale-[1.03]">
              <div className="flex items-center gap-3 mb-3">
                <ListChecks className="w-8 h-8" />
                <h3 className="text-xl font-bold">Set Preferences</h3>
              </div>
              <p className="opacity-90">
                Tell us your travel goals — match better with the right buddy.
              </p>
            </div>
          </Link>

          {/* 🤝 Travel Buddy Matching */}
          <Link to="/buddy">
            <div className="group bg-gradient-to-r from-[#ff9a9e] to-[#fad0c4] p-6 rounded-2xl shadow-xl text-white cursor-pointer transform transition hover:scale-[1.03]">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-8 h-8" />
                <h3 className="text-xl font-bold">Find Travel Buddy</h3>
              </div>
              <p className="opacity-90">
                Smart AI matching based on behavior + travel interests.
              </p>
            </div>
          </Link>

          {/* 💬 Chat */}
          <Link to="/chat">
            <div className="group bg-gradient-to-r from-[#a18cd1] to-[#fbc2eb] p-6 rounded-2xl shadow-xl text-white cursor-pointer transform transition hover:scale-[1.03]">
              <div className="flex items-center gap-3 mb-3">
                <MessageCircle className="w-8 h-8" />
                <h3 className="text-xl font-bold">Start Chat</h3>
              </div>
              <p className="opacity-90">
                Connect instantly with your matched buddies.
              </p>
            </div>
          </Link>

          {/* 🛡️ SOS */}
          <Link to="/sos">
            <div className="group bg-gradient-to-r from-[#ff758c] to-[#ff7eb3] p-6 rounded-2xl shadow-xl text-white cursor-pointer transform transition hover:scale-[1.03]">
              <div className="flex items-center gap-3 mb-3">
                <ShieldAlert className="w-8 h-8" />
                <h3 className="text-xl font-bold">Emergency SOS</h3>
              </div>
              <p className="opacity-90">
                Send alert + live location to trusted contacts.
              </p>
            </div>
          </Link>

          {/* ✈️ Explore Destinations */}
          <div className="group bg-gradient-to-r from-[#43e97b] to-[#38f9d7] p-6 rounded-2xl shadow-xl text-white cursor-pointer transform transition hover:scale-[1.03]">
            <div className="flex items-center gap-3 mb-3">
              <Plane className="w-8 h-8" />
              <h3 className="text-xl font-bold">Explore Destinations</h3>
            </div>
            <p className="opacity-90">
              Discover trending places, budgets, and tips.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}

