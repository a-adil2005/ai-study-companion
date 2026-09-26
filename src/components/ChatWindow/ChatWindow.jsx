import React, { useEffect, useRef } from "react";
import MessageBubble from "../MessageBubble/MessageBubble";
import LoadingSkeleton from "../LoadingSkeleton/LoadingSkeleton";
import PromptInput from "../PromptInput/PromptInput";
import "./ChatWindow.css";

function ChatWindow({ messages, onSendMessage, isLoading }) {
  const messagesEndRef = useRef(null);

  // Auto-scroll to the bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="empty-chat-state">
            <h1>Hello, Student</h1>
            <p>What would you like to master or review today?</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <MessageBubble key={index} sender={msg.sender} text={msg.text} />
          ))
        )}

        {isLoading && <LoadingSkeleton />}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area-wrapper">
        <PromptInput onSendMessage={onSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
}

export default ChatWindow;