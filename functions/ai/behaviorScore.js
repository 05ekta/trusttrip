// functions/ai/behaviorScore.js
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

exports.computeBehaviorScore = (behavior) => {
  if (!behavior) return 30; // baseline score

  const {
    likesGiven = 0,
    likesReceived = 0,
    views = 0,
    messagesCount = 0,
    acceptedInvites = 0,
  } = behavior;

  // Sentiment analysis on message count (simulating positivity)
  const sentimentScore = sentiment.analyze(
    "User is active and interacts often"
  ).score;

  // Simple scoring logic (0–100)
  let score =
    likesGiven * 2 +
    likesReceived * 3 +
    views * 1 +
    messagesCount * 4 +
    acceptedInvites * 5 +
    sentimentScore;

  return Math.min(100, Math.max(0, score));
};
