import { type NextRequest, NextResponse } from 'next/server'
import vm from 'node:vm'

export async function POST(req: NextRequest) {
  try {
    const { code, language } = await req.json()

    if (!['javascript', 'typescript'].includes(language)) {
      return NextResponse.json({
        stdout: '',
        stderr: `Only JavaScript/TypeScript execution is supported in free local mode. Current: ${language}`,
        exitCode: 1,
      })
    }

    const output: string[] = []

    const sandbox = {
      console: {
        log: (...args: unknown[]) => {
          output.push(args.map(String).join(' '))
        },
        error: (...args: unknown[]) => {
          output.push(args.map(String).join(' '))
        },
      },
    }

    vm.createContext(sandbox)

    // Basic TS cleanup for simple demo code
    const executableCode = code
      .replace(/: *number/g, '')
      .replace(/: *string/g, '')
      .replace(/: *boolean/g, '')
      .replace(/interface[\s\S]*?\}/g, '')

    vm.runInContext(executableCode, sandbox, {
      timeout: 3000,
    })

    return NextResponse.json({
      stdout: output.join('\n'),
      stderr: '',
      exitCode: 0,
    })
  } catch (err) {
    return NextResponse.json({
      stdout: '',
      stderr: err instanceof Error ? err.message : 'Execution failed',
      exitCode: 1,
    })
  }
}