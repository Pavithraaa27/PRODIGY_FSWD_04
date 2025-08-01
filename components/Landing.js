import React from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="overlay">
        <h1>Emotion Wellness Chatbot</h1>
        <p>Empower your mind. Chat with empathy.</p>
        <div className="buttons">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Register</button>
          <button onClick={() => navigate("/chat")}>Try Chatbot</button>
        </div>
      </div>
    </div>
  );
}

export default Landing;