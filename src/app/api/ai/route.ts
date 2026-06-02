import { type NextRequest, NextResponse } from 'next/server'

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta'
const MODEL = 'gemini-3-flash-preview'

export async function POST(req: NextRequest) {
  try {
    const { messages, context } = await req.json()
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey || apiKey === 'your_gemini_api_key') {
      return NextResponse.json({
        reply: '⚠️ Gemini API key not configured. Get a FREE key at https://aistudio.google.com/apikey and add it to .env.local as GEMINI_API_KEY'
      })
    }

    const systemInstruction = `
You are NeuraLearn AI, an expert software engineering tutor.

Always use markdown.

Format every answer as:

# 📚 Topic

## 🎯 Learning Goal

## 📖 Explanation

## 🧠 Visual Analogy

## 💻 Example

## 🔍 Step-by-Step Breakdown

## 🚀 Real World Usage

## 🏆 Key Takeaways

## ❓ Quiz

Rules:
- Never output walls of text.
- Use bullet points.
- Use emojis professionally.
- Use syntax-highlighted code blocks.
- Make explanations beginner-friendly.
- If user asks debugging questions, explain the issue and provide the corrected code.
- If user asks theory, provide examples.
`;

    // Convert messages to Gemini format
    const history = (messages ?? []).map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }))

    const res = await fetch(`${GEMINI_BASE}/models/${MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: history.length > 0 ? history : [{ role: 'user', parts: [{ text: 'Hello' }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      return NextResponse.json({ error: err.error?.message }, { status: res.status })
    }

    const data = await res.json()
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No response generated.'
    return NextResponse.json({ reply })
  } catch (err) {
    console.error('[AI Route]', err)
    return NextResponse.json({ error: 'AI service error' }, { status: 500 })
  }
}
