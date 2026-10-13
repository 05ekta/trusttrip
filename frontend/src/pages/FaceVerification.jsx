// frontend/src/pages/FaceVerification.jsx
import React, { useRef, useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function FaceVerification() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      alert("Camera access denied ❌");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
  };

  const captureAndVerify = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg")
    );

    const formData = new FormData();
    formData.append("file", blob, "capture.jpg");

    try {
      setLoading(true);

      // Call backend face verification endpoint
      const res = await fetch("http://localhost:5000/api/verify-face", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.verified) {
        // Save verification status in Firestore
        await setDoc(
          doc(db, "users", user.uid),
          { faceVerified: true },
          { merge: true }
        );

        alert("✅ Face verified successfully!");
        navigate("/"); // redirect to dashboard
      } else {
        alert("❌ Face verification failed. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Server error during verification.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Face Verification
      </h2>

      <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col items-center">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="rounded-md border mb-4 w-[320px] h-[240px]"
        />
        <canvas
          ref={canvasRef}
          width="320"
          height="240"
          className="hidden"
        ></canvas>

        <button
          onClick={captureAndVerify}
          disabled={loading}
          className={`px-5 py-2 rounded-md text-white font-semibold transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Verifying..." : "Capture & Verify"}
        </button>

        <button
          onClick={() => navigate("/login")}
          className="mt-4 text-blue-600 hover:underline text-sm"
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
}

