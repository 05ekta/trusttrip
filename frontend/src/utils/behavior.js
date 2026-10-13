// frontend/src/utils/behavior.js
import { auth, db } from "../firebase";
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  arrayUnion,
  increment,
  serverTimestamp,
} from "firebase/firestore";

/* ---------------------------------------------
   Ensure behavior document exists
---------------------------------------------- */
async function ensureBehaviorDoc(uid) {
  const ref = doc(db, "behavior", uid);

  await setDoc(
    ref,
    {
      uid,
      createdAt: serverTimestamp(),
      lastActive: serverTimestamp(),

      // behavior analytics:
      profileViews: [],   // { viewer, time }
      likesGiven: 0,
      likesReceived: 0,
      messagesSent: 0,
      messagesReceived: 0,
    },
    { merge: true }
  );

  return ref;
}

/* ---------------------------------------------
   Record profile view
---------------------------------------------- */
export async function recordProfileView(targetUid) {
  const me = auth.currentUser;
  if (!me) return;

  if (me.uid === targetUid) return;

  await ensureBehaviorDoc(targetUid);
  await ensureBehaviorDoc(me.uid);

  await updateDoc(doc(db, "behavior", targetUid), {
    profileViews: arrayUnion({
      viewer: me.uid,
      time: Date.now(),
    }),
    lastActive: serverTimestamp(),
  });
}

/* ---------------------------------------------
   Record like
---------------------------------------------- */
export async function recordLike(targetUid) {
  const me = auth.currentUser;
  if (!me) return;

  if (targetUid === me.uid) return;

  await ensureBehaviorDoc(targetUid);
  await ensureBehaviorDoc(me.uid);

  await updateDoc(doc(db, "behavior", targetUid), {
    likesReceived: increment(1),
  });

  await updateDoc(doc(db, "behavior", me.uid), {
    likesGiven: increment(1),
    lastActive: serverTimestamp(),
  });
}

/* ---------------------------------------------
   Record message
---------------------------------------------- */
export async function recordMessageSent(targetUid) {
  const me = auth.currentUser;
  if (!me) return;

  await ensureBehaviorDoc(me.uid);
  await ensureBehaviorDoc(targetUid);

  await updateDoc(doc(db, "behavior", me.uid), {
    messagesSent: increment(1),
    lastActive: serverTimestamp(),
  });

  await updateDoc(doc(db, "behavior", targetUid), {
    messagesReceived: increment(1),
  });
}

/* ---------------------------------------------
   Update user last active
---------------------------------------------- */
export async function updateLastActive() {
  const me = auth.currentUser;
  if (!me) return;

  await ensureBehaviorDoc(me.uid);

  await updateDoc(doc(db, "behavior", me.uid), {
    lastActive: serverTimestamp(),
  });
}

/* ---------------------------------------------
   Compatibility Score Calculation (0–100)
---------------------------------------------- */
export async function calculateCompatibility(targetUid) {
  const me = auth.currentUser;
  if (!me) return 0;

  try {
    const mySnap = await getDoc(doc(db, "behavior", me.uid));
    const theirSnap = await getDoc(doc(db, "behavior", targetUid));

    if (!mySnap.exists() || !theirSnap.exists()) return 30; // default base

    const meData = mySnap.data();
    const themData = theirSnap.data();

    let score = 50;

    // Active in last 24 hours?
    if (themData.lastActive?.toMillis() > Date.now() - 24 * 60 * 60 * 1000) {
      score += 10;
    }

    // Similar likesGiven
    if (Math.abs((meData.likesGiven || 0) - (themData.likesGiven || 0)) <= 3) {
      score += 10;
    }

    // Similar messages count
    if (
      Math.abs((meData.messagesSent || 0) - (themData.messagesSent || 0)) <= 3
    ) {
      score += 10;
    }

    // Cap at 100
    return Math.min(score, 100);
  } catch (err) {
    console.error("Compatibility error:", err);
    return 20;
  }
}


