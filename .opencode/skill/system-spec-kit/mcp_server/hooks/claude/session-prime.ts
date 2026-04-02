#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: SessionStart Hook — Session Prime
// ───────────────────────────────────────────────────────────────
// Runs on Claude Code SessionStart event. Injects context via stdout
// based on the session source (compact, startup, resume, clear).

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  parseHookStdin, hookLog, formatHookOutput, truncateToTokenBudget,
  withTimeout, HOOK_TIMEOUT_MS, COMPACTION_TOKEN_BUDGET, SESSION_PRIME_TOKEN_BUDGET,
  calculatePressureAdjustedBudget, sanitizeRecoveredPayload, wrapRecoveredCompactPayload,
  type OutputSection,
} from './shared.js';
import { ensureStateDir, loadState, readCompactPrime, clearCompactPrime } from './hook-state.js';

const CACHE_TTL_MS = 30 * 60 * 1000;
type StartupBrief = {
  graphOutline: string | null;
  sessionContinuity: string | null;
  graphSummary: { files: number; nodes: number; edges: number; lastScan: string | null } | null;
  graphState: 'ready' | 'empty' | 'missing';
};

// Dynamic import for code-graph-db — may not be available
let getStats: (() => { lastScanTimestamp: string | null; [key: string]: unknown }) | null = null;
try {
  const mod = await import('../../lib/code-graph/code-graph-db.js');
  getStats = mod.getStats;
} catch {
  // Code graph module not available — skip stale index detection
}

// Dynamic import for startup brief builder — may not be available
let buildStartupBrief: (() => StartupBrief) | null = null;
try {
  const mod = await import('../../lib/code-graph/startup-brief.js');
  buildStartupBrief = mod.buildStartupBrief;
} catch {
  // Startup brief module not available — keep static startup output
}

/** Handle source=compact: inject cached PreCompact payload (from 3-source merger) */
function handleCompact(sessionId: string): OutputSection[] {
  const state = loadState(sessionId);
  const pendingCompactPrime = readCompactPrime(sessionId);
  if (!pendingCompactPrime) {
    hookLog('warn', 'session-prime', `No cached compact payload for session ${sessionId}`);
    return [{
      title: 'Context Recovery',
      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
    }];
  }

  const { payload, cachedAt } = pendingCompactPrime;
  const cachedAtMs = new Date(cachedAt).getTime();
  const cacheAgeMs = Date.now() - cachedAtMs;
  if (Number.isNaN(cachedAtMs) || cacheAgeMs >= CACHE_TTL_MS) {
    hookLog('warn', 'session-prime', `Rejecting stale compact cache for session ${sessionId} (cached at ${cachedAt})`);
    return [{
      title: 'Context Recovery',
      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
    }];
  }

  const sanitizedPayload = sanitizeRecoveredPayload(payload);
  const wrappedPayload = wrapRecoveredCompactPayload(payload, cachedAt);
  hookLog('info', 'session-prime', `Injecting cached compact brief (${sanitizedPayload.length} chars after sanitization, cached at ${cachedAt})`);

  const sections: OutputSection[] = [
    { title: 'Recovered Context (Post-Compaction)', content: wrappedPayload },
    {
      title: 'Recovery Instructions',
      content: 'Context was compacted and auto-recovered from the cached compact brief. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
    },
  ];

  // Add last spec folder if known
  if (state?.lastSpecFolder) {
    sections.push({
      title: 'Active Spec Folder',
      content: `Last active: ${state.lastSpecFolder}`,
    });
  }

  return sections;
}

/** Check if CocoIndex Code binary is available */
function checkCocoIndexAvailable(): string {
  const cccPath = resolve(process.cwd(), '.opencode/skill/mcp-coco-index/mcp_server/.venv/bin/ccc');
  if (existsSync(cccPath)) {
    return '- CocoIndex Code: available (semantic code search via `mcp__cocoindex_code__search`)';
  }
  return '- CocoIndex Code: not installed (run `bash .opencode/skill/mcp-coco-index/scripts/install.sh`)';
}

/** Handle source=startup: prime new session with constitutional memories + overview */
function handleStartup(): OutputSection[] {
  const cocoStatus = checkCocoIndexAvailable();
  const sections: OutputSection[] = [
    {
      title: 'Session Priming',
      content: [
        'Spec Kit Memory is active. Key tools available:',
        '- `memory_context({ input, mode })` — unified context retrieval',
        '- `memory_match_triggers({ prompt })` — fast trigger matching',
        '- `memory_search({ query })` — semantic search',
        cocoStatus,
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

  // Stale code graph index detection
  try {
    if (getStats && startupBrief?.graphState !== 'empty') {
      const stats = getStats();
      const ts = stats.lastScanTimestamp;
      const isStale = !ts || (Date.now() - new Date(ts).getTime() > 24 * 60 * 60 * 1000);
      if (isStale) {
        sections.push({
          title: 'Stale Code Graph Warning',
          content: 'Code graph index is >24h old. Run `code_graph_scan` for fresh structural context.',
        });
      }
    }
  } catch {
    // DB not initialized or not available — skip silently
  }

  return sections;
}

/** Handle source=resume: load resume context for continued session */
function handleResume(sessionId: string): OutputSection[] {
  const state = loadState(sessionId);
  const sections: OutputSection[] = [];

  if (state?.lastSpecFolder) {
    sections.push({
      title: 'Session Continuity',
      content: `Last active spec folder: ${state.lastSpecFolder}\nCall \`memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })\` for full context.`,
    });
  } else {
    sections.push({
      title: 'Session Resume',
      content: 'Call `memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })` to restore session state.',
    });
  }

  return sections;
}

/** Handle source=clear: minimal output after /clear */
function handleClear(): OutputSection[] {
  return [
    {
      title: 'Fresh Context',
      content: 'Session cleared. Spec Kit Memory is active. Use `memory_context` or `memory_match_triggers` to load relevant context.',
    },
  ];
}

async function main(): Promise<void> {
  ensureStateDir();

  const input = await withTimeout(parseHookStdin(), HOOK_TIMEOUT_MS, null);
  if (!input) {
    hookLog('warn', 'session-prime', 'No stdin input received');
    return;
  }

  const sessionId = input.session_id ?? 'unknown';
  const source = input.source ?? 'startup';
  hookLog('info', 'session-prime', `SessionStart triggered (source: ${source}, session: ${sessionId})`);

  let sections: OutputSection[];
  let budget: number;

  switch (source) {
    case 'compact':
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

  // Apply token pressure awareness — reduce budget when context window is filling up
  const adjustedBudget = calculatePressureAdjustedBudget(
    input.context_window_tokens as number | undefined,
    input.context_window_max as number | undefined,
    budget,
  );
  if (adjustedBudget !== budget) {
    hookLog('info', 'session-prime', `Token pressure: budget ${budget} → ${adjustedBudget} (window ${input.context_window_tokens}/${input.context_window_max})`);
  }

  const output = truncateToTokenBudget(formatHookOutput(sections), adjustedBudget);

  // Write to stdout for Claude Code to inject into conversation.
  // Clear compact payload only AFTER stdout write succeeds to prevent
  // data loss if the process crashes between clear and write.
  process.stdout.write(output);
  if (source === 'compact') {
    clearCompactPrime(sessionId);
  }
  hookLog('info', 'session-prime', `Output ${output.length} chars for source=${source}`);
}

// Run — exit cleanly even on error
main().catch((err: unknown) => {
  hookLog('error', 'session-prime', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
}).finally(() => {
  process.exit(0);
});
