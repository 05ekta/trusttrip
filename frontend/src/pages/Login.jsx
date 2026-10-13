import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Email/Password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Login successful ✅");
      navigate("/"); // Redirect to dashboard
    } catch (err) {
      alert(err.message);
    }
  };

  // Google login
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert("Google login successful ✅");
      navigate("/"); // Redirect to dashboard
    } catch (err) {
      alert(err.message);
    }
  };

  // Forgot password
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first!");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent! 📧 Check your inbox.");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-blue-300 relative overflow-hidden">
      <div className="absolute top-10 left-10 w-40 h-40 bg-blue-200 rounded-full blur-2xl opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-200 rounded-full blur-2xl opacity-40"></div>

      <div className="bg-white shadow-2xl rounded-2xl p-8 w-[360px] relative z-10">
        <div className="flex justify-center mb-6">
          <img
            src="https://img.icons8.com/color/96/airplane-take-off.png"
            alt="TrustTrip Logo"
            className="w-14 h-14"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          TrustTrip
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Your journey starts here ✈️
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={handleForgotPassword}
            className="text-xs text-blue-500 hover:underline"
          >
            Forgot Password?
          </button>
        </div>

        <div className="text-center mt-3 text-xs text-gray-600">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:underline font-medium"
          >
            Register here
          </Link>
        </div>

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-300" />
          <span className="px-3 text-gray-400 text-sm">or continue with</span>
          <hr className="flex-grow border-gray-300" />
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2 hover:bg-gray-50 transition"
          >
            <img
              src="https://www.svgrepo.com/show/355037/google.svg"
              alt="Google"
              className="inline-block"
              style={{ width: "16px", height: "16px" }}
            />
            <span className="text-gray-700 text-sm font-medium">
              Continue with Google
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
