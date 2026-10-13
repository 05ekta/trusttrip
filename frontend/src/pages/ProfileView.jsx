import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { recordProfileView, recordLike } from "../utils/behavior";

export default function ProfileView() {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!uid) return;

    (async () => {
      setLoading(true);

      // User info
      const userSnap = await getDoc(doc(db, "users", uid));
      if (userSnap.exists()) setUserData(userSnap.data());

      // Preferences
      const prefSnap = await getDoc(doc(db, "preferences", uid));
      if (prefSnap.exists()) setPrefs(prefSnap.data());

      setLoading(false);

      // Record profile view
      const me = auth.currentUser;
      if (me && me.uid !== uid) {
        await recordProfileView(uid);
      }
    })();
  }, [uid]);

  if (loading) return <div className="p-8 text-center">Loading profile…</div>;

  if (!userData)
    return <div className="p-8 text-center">User not found</div>;

  return (
    <div className="min-h-screen p-8 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        {/* HEADER */}
        <h2 className="text-2xl font-bold">{userData.name}</h2>
        <p className="text-gray-600">{userData.email}</p>

        {/* TRAVEL PREFERENCES */}
        <h3 className="text-xl mt-6 font-semibold">Travel Preferences</h3>

        {prefs ? (
          <div className="mt-3 text-gray-700 space-y-1">
            <p><strong>Destination:</strong> {prefs.destination}</p>
            <p><strong>Month:</strong> {prefs.month}</p>
            <p><strong>Budget:</strong> ₹{prefs.budgetMin} - ₹{prefs.budgetMax}</p>
            <p><strong>Travel Style:</strong> {prefs.travelStyle}</p>
            <p><strong>Interests:</strong> {prefs.interests.join(", ")}</p>
          </div>
        ) : (
          <p className="text-gray-500 mt-3">This user has not set preferences yet.</p>
        )}

        {/* ACTION BUTTONS */}
        <div className="mt-6 flex gap-3">

          {/* LIKE BUTTON */}
          <button
            onClick={() => recordLike(uid)}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-md"
          >
            ❤️ Like
          </button>

          {/* MESSAGE BUTTON */}
          <button
            onClick={() => navigate(`/chat/${uid}`)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            💬 Message
          </button>

          {/* OPTIONAL INVITE BUTTON */}
          <button
            onClick={() => alert('Invite feature coming soon!')}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
          >
            🤝 Invite
          </button>
        </div>
      </div>
    </div>
  );
}
