import * as tf from '@tensorflow/tfjs';

// Placeholder for more realistic logic (simulate model behavior)
export const predictEmotion = async (text) => {
  const lower = text.toLowerCase();

  const emotionScores = {
    happy: 0,
    sad: 0,
    angry: 0,
    anxious: 0,
    lonely: 0,
    tired: 0,
    neutral: 0,
  };

  // Simulate word-based scoring
  const emotionKeywords = {
    happy: ["happy", "joy", "excited", "cheerful", "good"],
    sad: ["sad", "depressed", "down", "cry", "unhappy"],
    angry: ["angry", "mad", "furious", "rage", "annoyed"],
    anxious: ["anxious", "worried", "nervous", "scared", "stress"],
    lonely: ["lonely", "alone", "isolated", "ignored"],
    tired: ["tired", "exhausted", "sleepy", "drained"],
  };

  for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        emotionScores[emotion]++;
      }
    }
  }

  // Determine the emotion with the highest score
  const predicted = Object.entries(emotionScores).reduce((a, b) => (a[1] > b[1] ? a : b))[0];

  // Fallback if no emotion matched
  return predicted === "neutral" || emotionScores[predicted] === 0 ? "neutral" : predicted;
};