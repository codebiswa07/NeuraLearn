import { type NextRequest, NextResponse } from 'next/server'

// Piston API — FREE, no key needed!
const PISTON_API = 'https://emkc.org/api/v2/piston'

const LANG_MAP: Record<string, { language: string; version: string }> = {
  typescript: { language: 'typescript', version: '5.0.3' },
  javascript: { language: 'javascript', version: '18.15.0' },
  python:     { language: 'python',     version: '3.10.0' },
  go:         { language: 'go',         version: '1.20.3' },
  rust:       { language: 'rust',       version: '1.68.2' },
  cpp:        { language: 'c++',        version: '10.2.0' },
}

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json()
    const lang = LANG_MAP[language]
    if (!lang) return NextResponse.json({ error: `Unsupported: ${language}` }, { status: 400 })

    const res = await fetch(`${PISTON_API}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: lang.language, version: lang.version,
        files: [{ content: code }],
        stdin: '', args: [],
        compile_timeout: 10000, run_timeout: 5000,
      }),
    })

    const data = await res.json()
    return NextResponse.json({
      stdout: data.run?.stdout ?? '',
      stderr: data.run?.stderr ?? '',
      exitCode: data.run?.code ?? 0,
    })
  } catch (err) {
    console.error('[Execute]', err)
    return NextResponse.json({ error: 'Execution service error' }, { status: 500 })
  }
}
