// Placeholder emotion logic
export function detectEmotionFromText(text) {
  text = text.toLowerCase();
  if (text.includes("sad") || text.includes("depressed")) return "sad";
  if (text.includes("angry") || text.includes("mad")) return "angry";
  if (text.includes("happy") || text.includes("joy")) return "happy";
  return "neutral";
}