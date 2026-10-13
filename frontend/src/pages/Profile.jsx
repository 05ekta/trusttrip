// frontend/src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  doc,
  getDoc,
} from "firebase/firestore";
import {
  recordLike,
  recordProfileView,
  recordMessageSent,
} from "../utils/behavior";

export default function Profile() {
  const [userData, setUserData] = useState(null); // preferences
  const [behavior, setBehavior] = useState(null); // behavior stats
  const [loading, setLoading] = useState(true);

  const user = auth.currentUser;

  // --------------------------------------------
  // LOAD PROFILE DATA
  // --------------------------------------------
  const loadData = async () => {
    if (!user) return;

    const prefSnap = await getDoc(doc(db, "preferences", user.uid));
    const behSnap = await getDoc(doc(db, "behavior", user.uid));

    if (prefSnap.exists()) setUserData(prefSnap.data());
    if (behSnap.exists()) setBehavior(behSnap.data());

    // automatically record profile view
    await recordProfileView(user.uid);

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading)
    return (
      <div className="text-center p-20 text-xl font-semibold">
        Loading Profile...
      </div>
    );

  if (!userData)
    return (
      <div className="text-center p-20 text-lg text-gray-600">
        ❗ You must complete your travel preferences first.
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-8">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-10">

        {/* Top Section */}
        <div className="flex items-center gap-6">
          <img
            src={user.photoURL || "https://i.pravatar.cc/120"}
            alt="profile"
            className="w-28 h-28 rounded-full shadow-lg"
          />

          <div>
            <h2 className="text-3xl font-bold text-gray-800">{userData.name}</h2>
            <p className="text-gray-600">{user.email}</p>
          </div>
        </div>

        <hr className="my-6" />

        {/* Travel Preferences */}
        <h3 className="text-2xl font-semibold text-gray-700 mb-4">
          🌍 Travel Preferences
        </h3>

        <div className="space-y-2 text-gray-700">
          <p>
            <strong>Destination:</strong> {userData.destination}
          </p>
          <p>
            <strong>Month:</strong> {userData.month}
          </p>
          <p>
            <strong>Budget:</strong> ₹{userData.budgetMin} – ₹{userData.budgetMax}
          </p>
          <p>
            <strong>Style:</strong> {userData.travelStyle}
          </p>
        </div>

        {/* Interests */}
        <h3 className="text-2xl font-semibold mt-6 mb-2 text-gray-700">
          🎯 Interests
        </h3>

        <div className="flex flex-wrap gap-2">
          {userData.interests.map((i) => (
            <span
              key={i}
              className="px-4 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium"
            >
              {i}
            </span>
          ))}
        </div>

        {/* Behavior Stats */}
        <h3 className="text-2xl font-semibold mt-8 mb-2 text-gray-700">
          ⭐ Behavior Stats
        </h3>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-gray-100 rounded-xl shadow-sm">
            <p className="text-3xl font-bold text-blue-600">
              {behavior?.views || 0}
            </p>
            <p className="text-gray-600 text-sm">Profile Views</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-xl shadow-sm">
            <p className="text-3xl font-bold text-green-600">
              {behavior?.likesReceived || 0}
            </p>
            <p className="text-gray-600 text-sm">Likes Received</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-xl shadow-sm">
            <p className="text-3xl font-bold text-purple-600">
              {behavior?.messagesCount || 0}
            </p>
            <p className="text-gray-600 text-sm">Messages Sent</p>
          </div>

          <div className="p-4 bg-gray-100 rounded-xl shadow-sm">
            <p className="text-3xl font-bold text-red-600">
              {behavior?.acceptedInvites || 0}
            </p>
            <p className="text-gray-600 text-sm">Invites Accepted</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={() => recordLike(user.uid)}
            className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl"
          >
            ❤️ Like
          </button>

          <button
            onClick={() => recordMessageSent(user.uid)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
          >
            💬 Send Message
          </button>
        </div>
      </div>
    </div>
  );
}
