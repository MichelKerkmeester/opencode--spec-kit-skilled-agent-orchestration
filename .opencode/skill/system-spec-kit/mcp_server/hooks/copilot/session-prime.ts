#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Copilot SessionStart Hook — Session Prime
// ───────────────────────────────────────────────────────────────
// GitHub Copilot CLI surfaces sessionStart hook output as an
// informational banner. We keep this hook read-only and emit the
// same startup summary shape used by the Claude/Gemini session-prime
// hooks so operators see consistent context across CLIs.

type StartupBrief = {
  startupSurface: string;
};

let buildStartupBrief: (() => StartupBrief) | null = null;
try {
  const mod = await import('../../lib/code-graph/startup-brief.js');
  buildStartupBrief = mod.buildStartupBrief;
} catch {
  // Startup brief builder unavailable — fall back to a minimal banner.
}

async function drainStdin(): Promise<void> {
  for await (const _chunk of process.stdin) {
    // Copilot passes JSON context on stdin. Drain it fully so the
    // hook cannot block the runtime on an unread pipe.
  }
}

function fallbackBanner(): string {
  return [
    'Session context received. Current state:',
    '',
    '- Memory: startup summary unavailable',
    '- Code Graph: unavailable',
    '- CocoIndex: unknown',
    '',
    'What would you like to work on?',
  ].join('\n');
}

async function main(): Promise<void> {
  await drainStdin();
  let startupBrief: StartupBrief | null = null;
  try {
    startupBrief = buildStartupBrief ? buildStartupBrief() : null;
  } catch (err: unknown) {
    process.stderr.write(`[copilot:session-prime] buildStartupBrief threw: ${err instanceof Error ? err.message : String(err)}\n`);
  }
  if (!buildStartupBrief) {
    process.stderr.write('[copilot:session-prime] WARNING: Startup brief module unavailable — using fallback surface\n');
  } else if (!startupBrief?.startupSurface) {
    process.stderr.write('[copilot:session-prime] WARNING: startupBrief missing or empty — possible startup-brief regression\n');
  }
  process.stdout.write((startupBrief?.startupSurface ?? fallbackBanner()) + '\n');
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[copilot:session-prime] ${message}\n`);
  process.exit(0);
});
