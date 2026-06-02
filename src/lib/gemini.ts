/**
 * Gemini AI Service for NeuraLearn
 * Model: gemini-3-flash-preview
 */

const GEMINI_API_BASE =
  "https://generativelanguage.googleapis.com/v1beta";

const MODEL = "gemini-3-flash-preview";

export interface GeminiMessage {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}

/**
 * Premium Tutor System Prompt
 */
export const SYSTEM_PROMPT = `
You are NeuraLearn AI, an expert programming tutor.

Your mission is to teach concepts in a modern, engaging way.

RULES:

1. Always use Markdown formatting.
2. Start with a title using an emoji.
3. Use headings and subheadings.
4. Explain concepts simply first.
5. Then provide technical details.
6. Use examples whenever possible.
7. Use code blocks with syntax highlighting.
8. Avoid walls of text.
9. Use bullet points.
10. Add a quiz at the end.

Response Template:

# 📚 Topic Name

## 🎯 Learning Goal
What the student will learn.

---

## 📖 Simple Explanation

Explain in beginner-friendly language.

---

## 🧠 Visual Analogy

Use a real-world analogy.

---

## 💻 Example

Provide a practical example.

\`\`\`javascript
// code here
\`\`\`

---

## 🔍 Step-by-Step Breakdown

1. Step one
2. Step two
3. Step three

---

## 🚀 Real World Usage

Explain where it's used in industry.

---

## 🏆 Key Takeaways

- Point 1
- Point 2
- Point 3

---

## ❓ Quick Quiz

Ask one multiple-choice question.

Keep responses visually attractive.
Use emojis sparingly and professionally.
Never return a giant paragraph.
`;

export async function geminiChat(
  history: GeminiMessage[],
  apiKey: string
): Promise<string> {
  const response = await fetch(
    `${GEMINI_API_BASE}/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },

        contents: history,

        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        },

        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE",
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error?.error?.message || "Failed to generate response"
    );
  }

  const data = await response.json();

  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I couldn't generate a response."
  );
}

/**
 * Streaming Version
 */
export async function geminiStream(
  history: GeminiMessage[],
  apiKey: string,
  onChunk: (text: string) => void
): Promise<void> {
  const response = await fetch(
    `${GEMINI_API_BASE}/models/${MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },

        contents: history,

        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to start Gemini stream");
  }

  const reader = response.body?.getReader();

  if (!reader) {
    throw new Error("Stream reader unavailable");
  }

  const decoder = new TextDecoder();

  let accumulatedText = "";

  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    const chunk = decoder.decode(value);

    const lines = chunk
      .split("\n")
      .filter((line) => line.startsWith("data:"));

    for (const line of lines) {
      try {
        const json = JSON.parse(line.replace("data:", "").trim());

        const text =
          json?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
          accumulatedText += text;
          onChunk(accumulatedText);
        }
      } catch {
        // Ignore malformed chunks
      }
    }
  }
}
