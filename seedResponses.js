const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Response = require("./Response");

// MongoDB URI — use your own if this is different
const uri = "mongodb+srv://pavithranair5858:uakwDC6LG9FpGFQX@chatbot.ohm3nb0.mongodb.net/?retryWrites=true&w=majority&appName=Chatbot";

async function seedData() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB");

    // Read the responses.json file
    const responses = JSON.parse(
      fs.readFileSync(path.join(__dirname, "responses.json"))
    );

    // Clear existing data
    await Response.deleteMany();
    console.log("🗑 Old responses cleared");

    // Insert new responses
    await Response.insertMany(responses);
    console.log("✅ Responses seeded to MongoDB.");

    mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error seeding:", err);
  }
}

seedData();