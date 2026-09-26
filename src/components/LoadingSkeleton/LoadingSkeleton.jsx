import React from "react";
import "./LoadingSkeleton.css";

function LoadingSkeleton() {
  return (
    <div className="loading-wrapper">
      <div className="loading-bubble">
        <div className="loading-sender">AI Study Companion</div>
        <div className="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
}

export default LoadingSkeleton;