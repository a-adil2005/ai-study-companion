import React, { useState } from "react";
import "./PromptInput.css";

function PromptInput({ onSendMessage, disabled }) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prompt.trim() || disabled) return;
    onSendMessage(prompt);
    setPrompt("");
  };

  return (
    <div className="prompt-input-container">
      <form onSubmit={handleSubmit} className="prompt-form">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask your AI Study Companion anything..."
          disabled={disabled}
          className="prompt-field"
        />
        <button type="submit" disabled={disabled || !prompt.trim()} className="send-btn">
          <span>⬆</span>
        </button>
      </form>
      <p className="prompt-disclaimer">
        AI may display inaccurate info. Verify important study facts.
      </p>
    </div>
  );
}

export default PromptInput;