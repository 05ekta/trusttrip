// frontend/src/pages/BuddyMatch.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";

export default function BuddyMatch() {
  const [myPrefs, setMyPrefs] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------------------------
  // 1️⃣ LOAD MY SAVED PREFERENCES
  // ---------------------------------------------
  const loadPreferences = async () => {
    const user = auth.currentUser;
    if (!user) return;

    const snap = await getDoc(doc(db, "preferences", user.uid));
    if (snap.exists()) setMyPrefs(snap.data());
  };

  // ---------------------------------------------
  // 2️⃣ FETCH MATCHES + REQUEST AI SCORE
  // ---------------------------------------------
  const loadMatches = async () => {
    const user = auth.currentUser;
    if (!user || !myPrefs) return;

    const prefSnap = await getDocs(collection(db, "preferences"));
    const results = [];

    for (const docSnap of prefSnap.docs) {
      const other = docSnap.data();
      if (other.uid === user.uid) continue; // skip myself

      // Hard filters
      if (myPrefs.destination !== other.destination) continue;
      if (myPrefs.month !== other.month) continue;

      const overlap =
        myPrefs.budgetMin <= other.budgetMax &&
        myPrefs.budgetMax >= other.budgetMin;

      if (!overlap) continue;

      // 🌟 Get AI-based behavior score from backend
      const res = await fetch(
        `http://localhost:5000/api/ai-score/${other.uid}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ myPrefs }),
        }
      );

      const data = await res.json();
      const finalScore = data.score || 0;

      results.push({
        ...other,
        score: finalScore,
      });
    }

    // Sort by highest match score
    results.sort((a, b) => b.score - a.score);

    setMatches(results);
  };

  // ---------------------------------------------
  // LOAD ONCE
  // ---------------------------------------------
  useEffect(() => {
    (async () => {
      await loadPreferences();
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (myPrefs) loadMatches();
  }, [myPrefs]);

  if (loading)
    return (
      <div className="text-center mt-20 text-xl font-semibold">
        Loading Matches...
      </div>
    );

  if (!myPrefs)
    return (
      <div className="text-center mt-20 text-lg text-gray-600">
        ❗ You must set your travel preferences first.
      </div>
    );

  // ---------------------------------------------
  // UI — BEAUTIFUL CARD GRID
  // ---------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 via-purple-100 to-pink-200 p-8">
      <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-10">
        <h2 className="text-4xl font-bold text-center mb-8 text-gray-800">
          ✈️ Best Travel Buddy Matches For You
        </h2>

        {matches.length === 0 && (
          <p className="text-center text-gray-500 text-lg">
            No matches found. Try adjusting your filters!
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {matches.map((m) => (
            <div
              key={m.uid}
              className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">{m.name}</h3>
                <span className="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-semibold">
                  {m.score}%
                </span>
              </div>

              <p className="text-gray-600 mb-2">
                <strong>Style: </strong>
                {m.travelStyle}
              </p>

              <p className="text-gray-600 mb-2">
                <strong>Interests: </strong>
                {m.interests.join(", ")}
              </p>

              <p className="text-gray-600 mb-4">
                <strong>Budget: </strong>₹{m.budgetMin} – ₹{m.budgetMax}
              </p>
              <button
                onClick={() => window.location.href = `/profile/${m.uid}`}
                className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium">
                View Profile
              </button>

              
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
