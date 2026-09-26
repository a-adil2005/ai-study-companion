import React from "react";
import "./MessageBubble.css";

function MessageBubble({ sender, text }) {
  const isUser = sender === "user";

  return (
    <div className={`message-wrapper ${isUser ? "user-wrapper" : "ai-wrapper"}`}>
      <div className={`message-bubble ${isUser ? "user-bubble" : "ai-bubble"}`}>
        <div className="message-sender">{isUser ? "You" : "AI Study Companion"}</div>
        <div className="message-text">{text}</div>
      </div>
    </div>
  );
}

export default MessageBubble;