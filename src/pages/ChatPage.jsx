import React, { useState, useEffect } from "react";
import Header from "../components/Header/Header";
import Sidebar from "../components/Sidebar/Sidebar";
import ChatWindow from "../components/ChatWindow/ChatWindow";
import AuthModal from "../components/Auth/AuthModal";
import { auth, onAuthStateChanged } from "../services/firebase"; // <--- Imported from local firebase service
import { 
  getUserChats, 
  saveChatToFirestore, 
  deleteChatFromFirestore 
} from "../services/firestoreService";
import { generateGeminiResponse } from "../services/geminiService";
import "./ChatPage.css";

function ChatPage({ toggleTheme, isDark }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Monitor Firebase Auth state and fetch user chats from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsGuest(false);
        setShowAuthModal(false);
        const cloudChats = await getUserChats(currentUser.uid);
        setChats(cloudChats);
        if (cloudChats.length > 0) {
          setActiveChatId(cloudChats[0].id);
        } else {
          setActiveChatId(null);
        }
      } else {
        setChats([]);
        setActiveChatId(null);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const activeChat = chats.find((c) => c.id === activeChatId) || null;
  const messages = activeChat ? activeChat.messages : [];

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Study Session",
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    if (user) {
      saveChatToFirestore(user.uid, newChat);
    }
  };

  const handleSelectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  const handleDeleteChat = (chatId) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);
    if (user) {
      deleteChatFromFirestore(chatId);
    }

    if (activeChatId === chatId) {
      if (updatedChats.length > 0) {
        setActiveChatId(updatedChats[0].id);
      } else {
        setActiveChatId(null);
      }
    }
  };

  const handleSendMessage = async (promptText) => {
    let currentChatId = activeChatId;
    let updatedChats = [...chats];

    if (!currentChatId || !updatedChats.some((c) => c.id === currentChatId)) {
      const newChat = {
        id: Date.now().toString(),
        title: promptText.slice(0, 30) + (promptText.length > 30 ? "..." : ""),
        messages: [],
      };
      updatedChats = [newChat, ...updatedChats];
      currentChatId = newChat.id;
      setActiveChatId(currentChatId);
    }

    const userMessage = { sender: "user", text: promptText };
    
    updatedChats = updatedChats.map((chat) => {
      if (chat.id === currentChatId) {
        const title =
          chat.title === "New Study Session"
            ? promptText.slice(0, 30) + (promptText.length > 30 ? "..." : "")
            : chat.title;
        const updatedChat = {
          ...chat,
          title,
          messages: [...chat.messages, userMessage],
        };
        if (user) {
          saveChatToFirestore(user.uid, updatedChat);
        }
        return updatedChat;
      }
      return chat;
    });

    setChats(updatedChats);
    setIsLoading(true);

    try {
      const aiResponseText = await generateGeminiResponse(promptText);
      const aiMessage = { sender: "ai", text: aiResponseText };

      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === currentChatId) {
            const updatedChat = {
              ...chat,
              messages: [...chat.messages, aiMessage],
            };
            if (user) {
              saveChatToFirestore(user.uid, updatedChat);
            }
            return updatedChat;
          }
          return chat;
        })
      );
    } catch (error) {
      const errorMessage = {
        sender: "ai",
        text: "⚠️ Gemini API Error. Please check your API key.",
      };
      setChats((prevChats) =>
        prevChats.map((chat) => {
          if (chat.id === currentChatId) {
            return {
              ...chat,
              messages: [...chat.messages, errorMessage],
            };
          }
          return chat;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return <div style={{ color: "#fff", textAlign: "center", marginTop: "20vh" }}>Loading...</div>;
  }

  const showModal = (!user && !isGuest) || showAuthModal;

  return (
    <div className="chat-page">
      {showModal && (
        <AuthModal 
          onLoginSuccess={(u) => {
            setUser(u);
            setShowAuthModal(false);
          }} 
          onContinueAsGuest={() => {
            setIsGuest(true);
            setShowAuthModal(false);
          }} 
        />
      )}
      <Header 
        toggleTheme={toggleTheme} 
        isDark={isDark} 
        user={user} 
        onOpenAuth={() => setShowAuthModal(true)} 
      />
      <div className="chat-page-body">
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
        />
        <ChatWindow
          messages={messages}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}

export default ChatPage;