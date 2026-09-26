import React from "react";
import { Link } from "react-router-dom";
import { logoutUser } from "../../services/firebase";
import "./Header.css";

function Header({ toggleTheme, isDark, user, onOpenAuth }) {
  return (
    <header className="app-header">
      <div className="header-left">
        <h2 className="app-logo">AI Study Companion</h2>
      </div>
      <div className="header-right">
        {user ? (
          <div className="user-profile">
            {user.photoURL && (
              <img src={user.photoURL} alt={user.displayName || "User"} className="user-avatar" />
            )}
            <span className="user-email-text">{user.email}</span>
            <button onClick={logoutUser} className="logout-btn">Sign Out</button>
          </div>
        ) : (
          <button onClick={onOpenAuth} className="login-trigger-btn">
            Sign In
          </button>
        )}
        <button onClick={toggleTheme} className="theme-toggle-btn">
          {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
        <Link to="/settings" className="settings-link-btn">
          ⚙️ Settings
        </Link>
      </div>
    </header>
  );
}

export default Header;