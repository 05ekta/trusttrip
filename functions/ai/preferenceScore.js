// functions/ai/preferenceScore.js

exports.computePreferenceScore = (me, other) => {
  let score = 0;

  // Travel style match
  if (me.travelStyle === other.travelStyle) score += 30;

  // Shared interests (10 points each)
  const shared = me.interests.filter((i) => other.interests.includes(i));
  score += shared.length * 10;

  // Budget overlap logic
  const overlap =
    me.budgetMin <= other.budgetMax &&
    me.budgetMax >= other.budgetMin;
  if (overlap) score += 20;

  return Math.min(100, score);
};
