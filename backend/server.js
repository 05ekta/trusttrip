import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import streamifier from "streamifier";
import { v2 as cloudinary } from "cloudinary";
import { dbAdmin } from "./admin.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// -------------------------------------------------
// CLOUDINARY
// -------------------------------------------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dec3o7bfl",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// -------------------------------------------------
// IMAGE UPLOAD
// -------------------------------------------------
const upload = multer({ storage: multer.memoryStorage() });

app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file provided" });

  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: "trusttrip/uploads",
      resource_type: "image",
    },
    (error, result) => {
      if (error) return res.status(500).json({ error: "Upload failed" });
      res.json({ url: result.secure_url });
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
});

// -------------------------------------------------
// AI SCORE MODEL
// -------------------------------------------------
function computeAIScore(behavior, myPrefs, otherPrefs) {
  let score = 0;

  // Engagement score
  const engagement =
    (behavior.likesGiven || 0) * 4 +
    (behavior.likesReceived || 0) * 5 +
    (behavior.messagesCount || 0) * 3;

  // Reliability score
  const reliability = (behavior.acceptedInvites || 0) * 10;

  // Views
  const social = (behavior.views || 0) * 1.5;

  // Activity freshness
  const now = Date.now();
  const daysInactive = (now - (behavior.lastActive || 0)) / (1000 * 60 * 60 * 24);
  const activityScore =
    daysInactive < 3 ? 20 : daysInactive < 7 ? 10 : 0;

  // Preference match score
  let preferenceScore = 0;

  if (myPrefs.travelStyle === otherPrefs.travelStyle) preferenceScore += 20;

  const sharedInterests = myPrefs.interests.filter((i) =>
    otherPrefs.interests.includes(i)
  );
  preferenceScore += sharedInterests.length * 5;

  // Final weighted score
  score =
    engagement * 0.3 +
    reliability * 0.25 +
    social * 0.15 +
    activityScore * 1 +
    preferenceScore * 1.2;

  return Math.min(Math.round(score), 100);
}

// -------------------------------------------------
// API: AI SCORE
// -------------------------------------------------
app.post("/api/ai-score/:uid", async (req, res) => {
  try {
    const targetUid = req.params.uid;
    const myPrefs = req.body.myPrefs;

    const behaviorSnap = await dbAdmin.collection("behavior").doc(targetUid).get();

    if (!behaviorSnap.exists()) {
      return res.json({ score: 10 });
    }

    const behavior = behaviorSnap.data();

    const prefsSnap = await dbAdmin.collection("preferences").doc(targetUid).get();

    if (!prefsSnap.exists()) {
      return res.json({ score: 10 });
    }

    const otherPrefs = prefsSnap.data();

    const score = computeAIScore(behavior, myPrefs, otherPrefs);

    return res.json({ score });
  } catch (err) {
    console.error("AI scoring error:", err);
    return res.status(500).json({ error: "Failed to calculate AI score" });
  }
});

// -------------------------------------------------
// START SERVER
// -------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🔥 Backend running on http://localhost:${PORT}`)
);
