import React, { useState } from "react";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function ImageUploader() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please choose a file first");

    // ✅ Ensure user is logged in
    const user = auth.currentUser;
    if (!user) return alert("You must be signed in to upload a file");

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        const imageUrl = data.url;
        setUrl(imageUrl);

        // ✅ Save the image URL to Firestore under the logged-in user
        await setDoc(
          doc(db, "users", user.uid),
          { photoURL: imageUrl },
          { merge: true }
        );

        alert("Upload successful! URL saved to Firestore");
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 border rounded-md shadow-md">
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="ml-2 px-3 py-1 bg-blue-600 text-white rounded"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {url && (
        <div className="mt-4">
          <p className="text-green-600">Uploaded file saved in Firestore:</p>
          <img src={url} alt="Uploaded" className="mt-2 w-64 rounded" />
        </div>
      )}
    </div>
  );
}
