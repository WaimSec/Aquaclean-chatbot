export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "OPENROUTER_API_KEY is not configured in Vercel Environment Variables."
    });
  }

  try {
    const { messages, temperature = 0.5, max_tokens = 450 } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages are required." });
    }

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": "https://aquaclean-auto-spa.vercel.app",
        "X-Title": "AquaClean Auto Spa"
      },
      body: JSON.stringify({
        model: "nex-agi/nex-n2.5-pro:free",
        messages,
        temperature,
        max_tokens
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || data?.error || "OpenRouter request failed."
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: error?.message || "Server error."
    });
  }
}
