import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();

  const menu = [
    { name: "Dashboard", icon: "🏠", path: "/" },

    // 🔥 FIXED — Buddy system should open preferences first
    { name: "Buddy Match", icon: "🤝", path: "/buddy/preferences" },

    { name: "Chat", icon: "💬", path: "/chat" },
    { name: "SOS", icon: "🚨", path: "/sos" },
  ];

  return (
    <div className="w-64 bg-white/80 backdrop-blur-md shadow-xl h-screen p-6 sticky top-0">
      <h1 className="text-2xl font-bold mb-8 text-gray-800">TrustTrip ✈️</h1>

      <div className="flex flex-col gap-3">
        {menu.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`p-3 rounded-lg flex items-center gap-3 text-lg transition 
              ${location.pathname === item.path ? "bg-blue-100" : "hover:bg-gray-100"}`}
          >
            <span>{item.icon}</span> {item.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
