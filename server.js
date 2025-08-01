const connectDB = require("./db");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const natural = require("natural");
const Message = require("./Message");
const Response = require("./Response");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());



// Stemmer
const stemmer = natural.PorterStemmer;

connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");

    // Get previous messages
    app.get("/api/messages", async (req, res) => {
      try {
        const messages = await Message.find().sort({ timestamp: 1 });
        res.json(messages);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch messages." });
      }
    });

    // Chat endpoint with fuzzy matching
    app.post("/api/chat", async (req, res) => {
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ reply: "Please provide a message.", emotion: "neutral" });
      }

      const lower = message.toLowerCase();
      let reply = "I'm here to listen. Tell me more about how you feel.";
      let emotion = "neutral";

      // Fuzzy matching logic using Jaro-Winkler
      const allResponses = await Response.find();
      for (let entry of allResponses) {
        for (let keyword of entry.keywords) {
          const similarity = natural.JaroWinklerDistance(lower, keyword);
          if (similarity > 0.85) {
            reply = entry.reply;
            emotion = entry.emotion;
            break;
          }
        }
        if (reply !== "I'm here to listen. Tell me more about how you feel.") {
          break;
        }
      }

      try {
        // Save user message
        await Message.create({ text: message, sender: "user" });
        // Save bot reply
        await Message.create({ text: reply, sender: "bot" });

        res.json({ reply, emotion });
      } catch (err) {
        console.error("❌ Message saving error:", err);
        res.status(500).json({ reply: "Error saving messages.", emotion: "error" });
      }
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });