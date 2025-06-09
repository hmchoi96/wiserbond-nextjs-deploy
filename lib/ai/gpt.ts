// lib/gpt.ts

type ChatRequestBody = {
  model: "gpt-4o" | "o3";
  messages: { role: "user"; content: string }[];
  temperature?: number;
};

export async function callGPT(prompt: string, model: "gpt-4o" | "o3" = "gpt-4o"): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ Missing OpenAI API Key.");
    return "⚠️ Server error: Missing API key.";
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
  };

  const body: ChatRequestBody = {
    model,
    messages: [{ role: "user", content: prompt }]
  };

  if (model === "gpt-4o") {
    body.temperature = 0.7;
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("❌ Invalid GPT response format:", data);
      return "⚠️ No valid response from GPT.";
    }

    console.log("✅ GPT model:", model);
    console.log("🧠 Prompt preview:", prompt.slice(0, 100));
    console.log("📝 Response preview:", data.choices[0].message.content.slice(0, 100));

    return data.choices[0].message.content;
  } catch (error: unknown) {
    console.error("❌ GPT API call failed:", error);
    return "⚠️ GPT request failed.";
  }
}
