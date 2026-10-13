const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const { computeBehaviorScore } = require("./ai/behaviorScore");
const { computePreferenceScore } = require("./ai/preferenceScore");

exports.generateBuddyMatches = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid;
  if (!uid) throw new functions.https.HttpsError("unauthenticated");

  const db = admin.firestore();

  const mePrefSnap = await db.collection("preferences").doc(uid).get();
  if (!mePrefSnap.exists)
    return { success: false, message: "Preferences not set" };

  const mePrefs = mePrefSnap.data();

  // Fetch all preferences
  const prefsSnap = await db.collection("preferences").get();

  const results = [];

  for (const docSnap of prefsSnap.docs) {
    const other = docSnap.data();

    if (other.uid === uid) continue; // skip myself

    // Hard filters
    if (mePrefs.destination !== other.destination) continue;
    if (mePrefs.month !== other.month) continue;

    // Load behavior for user
    const behaviorSnap = await db.collection("behavior").doc(other.uid).get();
    const behaviorData = behaviorSnap.exists ? behaviorSnap.data() : {};

    // Score calculations
    const behaviorScore = computeBehaviorScore(behaviorData);
    const prefScore = computePreferenceScore(mePrefs, other);

    const finalScore = Math.min(100, prefScore + behaviorScore);

    results.push({
      ...other,
      matchScore: finalScore,
    });
  }

  // Sort descending
  results.sort((a, b) => b.matchScore - a.matchScore);

  return {
    success: true,
    matches: results,
  };
});
