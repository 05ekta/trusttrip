export async function moderateMessage(text) {
  try {
    const response = await fetch("http://localhost:3000/api/moderate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const result = await response.json();

    // OpenAI moderation format: flagged = true → block message
    const flagged = result?.results?.[0]?.flagged;

    if (flagged) {
      return { allowed: false, reason: result };
    }

    return { allowed: true };
  } catch (err) {
    console.error("Moderation failed:", err);
    return { allowed: true }; // fail-open to avoid blocking legit messages
  }
}
