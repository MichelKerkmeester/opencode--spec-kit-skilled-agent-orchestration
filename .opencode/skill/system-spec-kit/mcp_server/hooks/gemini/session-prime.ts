#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Gemini SessionStart Hook — Session Prime
// ───────────────────────────────────────────────────────────────
// Runs on Gemini CLI SessionStart event. Outputs JSON to stdout
// with additionalContext for Gemini to inject into the conversation.
//
// Gemini stdin contract:
//   { session_id, transcript_path, cwd, hook_event_name, timestamp, source }
//   source: "startup" | "resume" | "clear"
//
// Gemini stdout contract:
//   Plain text → systemMessage (stderr-like)
//   JSON with hookSpecificOutput.additionalContext → injected into conversation

import {
  hookLog, formatHookOutput, truncateToTokenBudget,
  sanitizeRecoveredPayload, wrapRecoveredCompactPayload,
  withTimeout, HOOK_TIMEOUT_MS, COMPACTION_TOKEN_BUDGET, SESSION_PRIME_TOKEN_BUDGET,
  type OutputSection,
} from '../claude/shared.js';
import { ensureStateDir, loadState, readCompactPrime, clearCompactPrime } from '../claude/hook-state.js';
import { parseGeminiStdin, formatGeminiOutput } from './shared.js';

const CACHE_TTL_MS = 30 * 60 * 1000;
type StartupBrief = {
  graphOutline: string | null;
  sessionContinuity: string | null;
  graphSummary: { files: number; nodes: number; edges: number; lastScan: string | null } | null;
  graphState: 'ready' | 'empty' | 'missing';
};

let buildStartupBrief: (() => StartupBrief) | null = null;
try {
  const mod = await import('../../lib/code-graph/startup-brief.js');
  buildStartupBrief = mod.buildStartupBrief;
} catch {
  // Startup brief module not available — keep static startup output
}

/** Handle source=compact (post-compress): inject cached PreCompress payload */
function handleCompact(sessionId: string): OutputSection[] {
  const state = loadState(sessionId);
  const pendingCompactPrime = readCompactPrime(sessionId);
  if (!pendingCompactPrime) {
    hookLog('warn', 'gemini:session-prime', `No cached compact payload for session ${sessionId}`);
    return [{
      title: 'Context Recovery',
      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
    }];
  }

  const { payload, cachedAt } = pendingCompactPrime;
  const cachedAtMs = new Date(cachedAt).getTime();
  const cacheAgeMs = Date.now() - cachedAtMs;
  if (Number.isNaN(cachedAtMs) || cacheAgeMs >= CACHE_TTL_MS) {
    hookLog('warn', 'gemini:session-prime', `Rejecting stale compact cache (cached at ${cachedAt})`);
    return [{
      title: 'Context Recovery',
      content: 'Context was compressed. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
    }];
  }

  hookLog('info', 'gemini:session-prime', `Injecting cached compact brief (${payload.length} chars, cached at ${cachedAt})`);

  const wrappedPayload = wrapRecoveredCompactPayload(payload, cachedAt);
  const sections: OutputSection[] = [
    { title: 'Recovered Context (Post-Compression)', content: wrappedPayload },
    {
      title: 'Recovery Instructions',
      content: 'Context was compressed and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
    },
  ];

  if (state?.lastSpecFolder) {
    sections.push({
      title: 'Active Spec Folder',
      content: `Last active: ${state.lastSpecFolder}`,
    });
  }

  return sections;
}

/** Handle source=startup: prime new session with tool overview */
function handleStartup(): OutputSection[] {
  const sections: OutputSection[] = [
    {
      title: 'Session Priming',
      content: [
        'Spec Kit Memory is active. Key tools available:',
        '- `memory_context({ input, mode })` - unified context retrieval',
        '- `memory_match_triggers({ prompt })` - fast trigger matching',
        '- `memory_search({ query })` - semantic search',
        '- Code Graph: `code_graph_scan`, `code_graph_query`, `code_graph_context`, `code_graph_status`',
        '',
        'To resume prior work: `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })`',
      ].join('\n'),
    },
  ];

  const startupBrief = buildStartupBrief ? buildStartupBrief() : null;
  if (startupBrief?.graphOutline) {
    sections.push({
      title: 'Structural Context',
      content: startupBrief.graphOutline,
    });
  } else if (startupBrief?.graphState === 'empty') {
    sections.push({
      title: 'Structural Context',
      content: 'Code graph index is empty. Run `code_graph_scan` to build structural context.',
    });
  }

  if (startupBrief?.sessionContinuity) {
    sections.push({
      title: 'Session Continuity',
      content: startupBrief.sessionContinuity,
    });
  }

  const lastScan = startupBrief?.graphSummary?.lastScan ?? null;
  if (startupBrief?.graphState === 'ready' && (!lastScan || (Date.now() - new Date(lastScan).getTime() > 24 * 60 * 60 * 1000))) {
    sections.push({
      title: 'Stale Code Graph Warning',
      content: 'Code graph index is >24h old. Run `code_graph_scan` for fresh structural context.',
    });
  }

  return sections;
}

/** Handle source=resume: load resume context */
function handleResume(sessionId: string): OutputSection[] {
  const state = loadState(sessionId);

  if (state?.lastSpecFolder) {
    return [{
      title: 'Session Continuity',
      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
    }];
  }

  return [{
    title: 'Session Resume',
    content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
  }];
}

/** Handle source=clear: minimal output */
function handleClear(): OutputSection[] {
  return [{
    title: 'Fresh Context',
    content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
  }];
}

async function main(): Promise<void> {
  ensureStateDir();

  const input = await withTimeout(parseGeminiStdin(), HOOK_TIMEOUT_MS, null);
  if (!input) {
    hookLog('warn', 'gemini:session-prime', 'No stdin input received');
    return;
  }

  const sessionId = input.session_id ?? 'unknown';
  const source = input.source ?? 'startup';
  hookLog('info', 'gemini:session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);

  let sections: OutputSection[];
  let budget: number;

  switch (source) {
    case 'compact':
      // Gemini doesn't have a native compact source, but we handle it
      // in case BeforeAgent injects a one-shot compact recovery
      sections = handleCompact(sessionId);
      budget = COMPACTION_TOKEN_BUDGET;
      break;
    case 'startup':
      sections = handleStartup();
      budget = SESSION_PRIME_TOKEN_BUDGET;
      break;
    case 'resume':
      sections = handleResume(sessionId);
      budget = SESSION_PRIME_TOKEN_BUDGET;
      break;
    case 'clear':
      sections = handleClear();
      budget = SESSION_PRIME_TOKEN_BUDGET;
      break;
    default:
      sections = handleStartup();
      budget = SESSION_PRIME_TOKEN_BUDGET;
  }

  const rawOutput = truncateToTokenBudget(formatHookOutput(sections), budget);

  // Output as Gemini-compatible JSON with additionalContext.
  // Clear compact payload only AFTER stdout write succeeds.
  const output = formatGeminiOutput(rawOutput);
  process.stdout.write(output);
  if (source === 'compact') {
    clearCompactPrime(sessionId);
  }
  hookLog('info', 'gemini:session-prime', `Output ${rawOutput.length} chars for source=${source}`);
}

// Run — exit cleanly even on error
main().catch((err: unknown) => {
  hookLog('error', 'gemini:session-prime', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
}).finally(() => {
  process.exit(0);
});
