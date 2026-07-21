import fetch from "node-fetch";

/**
 * Sends the report's title + description (and optionally a photo) to an AI
 * model and asks it to return a structured classification. Falls back to
 * safe defaults if the AI call fails or the API key isn't set, so report
 * creation never breaks.
 */
export const classifyReport = async (title, description, imageUrl) => {
  const fallback = {
    category: "other",
    priority: "medium",
    aiReasoning: "AI classification unavailable — defaulted for manual review.",
  };

  if (!process.env.AI_API_KEY) {
    return fallback;
  }

  const prompt = `You are a civic issue triage assistant. Given a citizen's report, classify it.

Title: "${title}"
Description: "${description}"
${imageUrl ? "\nAlso look at the attached photo to judge severity — a photo showing a deep/dangerous issue should raise priority even if the description undersells it." : ""}

Respond with ONLY a JSON object, no other text, in this exact format:
{"category": "pothole|garbage|streetlight|water|sewage|other", "priority": "low|medium|high", "reasoning": "one short sentence explaining the priority"}

Priority guidance: "high" = safety risk (deep pothole, exposed wiring, sewage overflow), "medium" = inconvenience but not urgent, "low" = cosmetic/minor.`;

  try {
    // Build message content — plain text if no image, or a vision-style
    // array (text + image block) if a photo was attached
    const messageContent = imageUrl
      ? [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: imageUrl } },
        ]
      : prompt;

    const response = await fetch(process.env.AI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.AI_API_KEY}`,
        // OpenRouter attributes usage to your app when these are present.
        // Not required for the call to succeed, but recommended.
        "HTTP-Referer": process.env.CLIENT_URL || "http://localhost:5000",
        "X-Title": "Civic Issue Reporter",
      },
      body: JSON.stringify({
        // "openrouter/free" is a real router that picks among free models
        // and filters by capability (e.g. image input), so it's fine to
        // use — but it's non-deterministic. Set AI_MODEL in .env to pin a
        // specific model (e.g. "google/gemma-4-31b-it:free", which
        // supports both text and image input) if you want repeatable
        // behavior instead.
        model: process.env.AI_MODEL || "openrouter/free",
        messages: [{ role: "user", content: messageContent }],
        temperature: 0.2,
      }),
    });

    const data = await response.json();

    // fetch() does NOT throw on 4xx/5xx — OpenRouter returns a 200-shaped
    // JSON body with an `error` field instead. Without this check, a bad
    // key, bad model, or no credits fails silently into the fallback with
    // zero logging, which is exactly what was happening before.
    if (!response.ok || data.error) {
      console.error(
        "AI classification failed:",
        response.status,
        data.error?.message || JSON.stringify(data)
      );
      return fallback;
    }

    const rawText = data.choices?.[0]?.message?.content?.trim();
    if (!rawText) {
      console.error("AI classification failed: empty response body", JSON.stringify(data));
      return fallback;
    }

    // Strip markdown code fences if the model adds them despite instructions
    const cleanText = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanText);

    return {
      category: parsed.category || "other",
      priority: parsed.priority || "medium",
      aiReasoning: parsed.reasoning || "",
    };
  } catch (err) {
    console.error("AI classification failed:", err.message);
    return fallback;
  }
};