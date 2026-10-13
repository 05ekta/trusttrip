import { useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function BuddyPreferences() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [month, setMonth] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [travelStyle, setTravelStyle] = useState("");
  const [interests, setInterests] = useState([]);

  const toggleInterest = (i) => {
    if (interests.includes(i)) {
      setInterests(interests.filter((x) => x !== i));
    } else {
      setInterests([...interests, i]);
    }
  };

  const savePrefs = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) return alert("Please log in first");

    await setDoc(doc(db, "preferences", user.uid), {
      uid: user.uid,
      destination,
      month,
      budgetMin: Number(budgetMin),
      budgetMax: Number(budgetMax),
      travelStyle,
      interests,
      updatedAt: Date.now(),
    });

    alert("Preferences saved!");
    navigate("/buddy/matches");
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Set Your Travel Preferences</h1>

      <form onSubmit={savePrefs} className="space-y-4">
        <input
          type="text"
          placeholder="Destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />

        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Budget Min"
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
            className="w-1/2 p-3 border rounded"
            required
          />
          <input
            type="number"
            placeholder="Budget Max"
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
            className="w-1/2 p-3 border rounded"
            required
          />
        </div>

        <select
          className="w-full p-3 border rounded"
          value={travelStyle}
          onChange={(e) => setTravelStyle(e.target.value)}
          required
        >
          <option value="">Select Travel Style</option>
          <option value="Adventure">Adventure</option>
          <option value="Relaxed">Relaxed</option>
          <option value="Cultural">Cultural</option>
          <option value="Luxury">Luxury</option>
        </select>

        <h3 className="text-lg font-semibold">Interests</h3>
        <div className="flex flex-wrap gap-2">
          {["Beach", "Trekking", "Nightlife", "Food", "Photography"].map((i) => (
            <button
              type="button"
              key={i}
              onClick={() => toggleInterest(i)}
              className={`px-4 py-2 rounded ${
                interests.includes(i)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {i}
            </button>
          ))}
        </div>

        <button
          type="submit"
          className="w-full p-3 bg-green-600 text-white rounded-lg"
        >
          Save Preferences
        </button>
      </form>
    </div>
  );
}
