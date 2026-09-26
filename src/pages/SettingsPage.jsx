import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SettingsPage.css";

function SettingsPage() {
  const [apiKey, setApiKey] = useState(localStorage.getItem("user_gemini_key") || "");
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("user_gemini_key", apiKey.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>Application Settings</h1>
        <p>Configure your Gemini API key for your study companion.</p>

        <form onSubmit={handleSave} className="settings-form">
          <label htmlFor="apiKey">Custom Gemini API Key (Optional)</label>
          <input
            type="password"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="settings-input"
          />
          <small>
            If left blank, the app will use the environment fallback key.
          </small>

          <div className="settings-actions">
            <button type="submit" className="save-btn">Save Settings</button>
            <Link to="/" className="back-btn">Back to Chat</Link>
          </div>
        </form>

        {saved && <p className="success-msg">Settings saved successfully!</p>}
      </div>
    </div>
  );
}

export default SettingsPage;