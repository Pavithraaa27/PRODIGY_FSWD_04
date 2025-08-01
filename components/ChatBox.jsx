import * as tf from "@tensorflow/tfjs";

// Load your model from the public folder or a hosted location
let model = null;

export const loadModel = async () => {
  if (!model) {
    try {
      model = await tf.loadLayersModel("/model/model.json");
      console.log("✅ Emotion detection model loaded");
    } catch (error) {
      console.error("❌ Failed to load model:", error);
    }
  }
};

// Sample tokenizer - replace this with your trained tokenizer logic if needed
const tokenize = (text) => {
  const maxLen = 20;
  const words = text.toLowerCase().split(/\s+/);
  const wordToIndex = {
    happy: 1,
    sad: 2,
    angry: 3,
    excited: 4,
    nervous: 5,
    // Add more as needed based on your model
  };

  const tokens = words.map(word => wordToIndex[word] || 0);

  while (tokens.length < maxLen) {
    tokens.push(0); // pad with zeros
  }

  return tf.tensor([tokens]);
};

export const predictEmotion = async (text) => {
  await loadModel();
  const input = tokenize(text);
  const prediction = model.predict(input);
  const scores = await prediction.data();
  const emotionLabels = ["happy", "sad", "angry", "excited", "nervous"];

  const maxIndex = scores.indexOf(Math.max(...scores));
  return emotionLabels[maxIndex];
};