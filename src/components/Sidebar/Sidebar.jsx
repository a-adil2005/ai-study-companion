import React from "react";
import "./Sidebar.css";

function Sidebar({ chats, activeChatId, onSelectChat, onNewChat, onDeleteChat }) {
  return (
    <aside className="app-sidebar">
      <div className="sidebar-top">
        <button onClick={onNewChat} className="new-chat-btn">
          <span>+</span> New Chat
        </button>
      </div>

      <div className="chat-history-list">
        <p className="history-title">Recent Chats</p>
        {chats.length === 0 ? (
          <p className="no-chats">No recent chats</p>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`history-item ${chat.id === activeChatId ? "active" : ""}`}
              onClick={() => onSelectChat(chat.id)}
            >
              <span className="history-text" title={chat.title}>
                {chat.title || "New Study Session"}
              </span>
              <button
                className="delete-chat-btn"
                onClick={(e) => {
                  e.stopPropagation(); // Prevents switching to the chat when clicking delete
                  onDeleteChat(chat.id);
                }}
                title="Delete chat"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}

export default Sidebar;