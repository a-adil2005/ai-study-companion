import React, { useState } from "react";
import { 
  signInWithGoogle, 
  signInWithEmail, 
  signUpWithEmail 
} from "../../services/firebase";
import "./AuthModal.css";

function AuthModal({ onLoginSuccess, onContinueAsGuest }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError("");
    try {
      let user;
      if (isRegistering) {
        user = await signUpWithEmail(email, password);
      } else {
        user = await signInWithEmail(email, password);
      }
      onLoginSuccess(user);
    } catch (err) {
      setError(err.message.replace("Firebase: ", ""));
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const user = await signInWithGoogle();
      onLoginSuccess(user);
    } catch (err) {
      setError("Failed to sign in with Google.");
    }
  };

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <h2>AI Study Companion</h2>
        <p>Sign in to sync your study chats in the cloud, or continue as a guest.</p>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleEmailAuth} className="auth-form">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="auth-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="auth-input"
          />
          <button type="submit" className="primary-auth-btn">
            {isRegistering ? "Create Account" : "Sign In with Email"}
          </button>
        </form>

        <div className="auth-divider"><span>OR</span></div>

        <button onClick={handleGoogleAuth} className="google-signin-btn">
          Sign in with Google
        </button>

        <div className="auth-switch">
          {isRegistering ? (
            <p>Already have an account? <span onClick={() => setIsRegistering(false)}>Sign In</span></p>
          ) : (
            <p>Need an account? <span onClick={() => setIsRegistering(true)}>Register</span></p>
          )}
        </div>

        <div className="auth-guest-section">
          <button onClick={onContinueAsGuest} className="guest-btn">
            Continue without account (Guest Mode)
          </button>
        </div>
      </div>
    </div>
  );
}

export default AuthModal;