const mongoose = require("mongoose");

const connectDB = async () => {
  const uri = "mongodb+srv://pavithranair5858:uakwDC6LG9FpGFQX@chatbot.ohm3nb0.mongodb.net/?retryWrites=true&w=majority&appName=Chatbot"; // Replace with actual URI
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

module.exports = connectDB;