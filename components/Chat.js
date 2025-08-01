import { predictEmotion } from "../emotionModel";
import React, { useState, useEffect, useRef } from "react";
import "./Chat.css";
import axios from "axios";

function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [theme, setTheme] = useState("dark");
  const [showHistory, setShowHistory] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("chatMessages");
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatMessages", JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
  if (message.trim() === "") return;

  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const newUserMessage = { sender: "user", text: message, time: now };

  setMessages((prev) => [...prev, newUserMessage]);
  setMessage("");
  setIsBotTyping(true);

  try {
    console.log("➡ Predicting emotion for:", message);
    const emotion = await predictEmotion(message);
    console.log("✅ Predicted emotion:", emotion);

    const res = await axios.post("http://localhost:5000/api/chat", {
      message: message,
      emotion: emotion,
    });

    console.log("🟢 Bot reply received:", res.data.reply);

    const newBotMessage = {
      sender: "bot",
      text: res.data.reply,
      time: now,
      emotion: res.data.emotion || "neutral",
    };

    setTimeout(() => {
      setMessages((prev) => [...prev, newBotMessage]);
      setIsBotTyping(false);
    }, 1000);
  } catch (error) {
    console.error("❌ Error sending message:", error);
    setIsBotTyping(false);
  }
};

  return (
    <div className={`chat-container ${theme}`}>
      <h2>Emotion Wellness Chat</h2>
      <div className="top-buttons">
        <button
          className="theme-toggle"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          Switch to {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
        <button
          className="history-toggle"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>
      </div>

      <div className="chat-box" ref={chatBoxRef}>
        {messages.length === 0 && (
          <div className="empty-message">No messages yet. Start chatting!</div>
        )}

        {(showHistory ? messages : messages.slice(-2)).map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender} ${msg.emotion || "neutral"}`}
          >
            <div className="bubble">
              {msg.text}
              <div className="timestamp">{msg.time}</div>
            </div>
          </div>
        ))}

        {isBotTyping && (
          <div className="message bot typing-indicator">
            <div className="bubble">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          type="text"
          value={message}
          placeholder="Type your message..."
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}

export default Chat;