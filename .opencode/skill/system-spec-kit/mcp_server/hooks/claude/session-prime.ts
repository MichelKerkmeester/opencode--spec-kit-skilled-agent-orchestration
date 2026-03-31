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
  type HookInput, type OutputSection,
} from './shared.js';
import { ensureStateDir, loadState, updateState } from './hook-state.js';

// Dynamic import for code-graph-db — may not be available
let getStats: (() => { lastScanTimestamp: string | null; [key: string]: unknown }) | null = null;
try {
  const mod = await import('../../lib/code-graph/code-graph-db.js');
  getStats = mod.getStats;
} catch {
  // Code graph module not available — skip stale index detection
}

/** Calculate token budget adjusted for context window pressure */
function calculatePressureBudget(input: HookInput, baseBudget: number): number {
  const usage = input.context_window_tokens as number | undefined;
  const max = input.context_window_max as number | undefined;
  if (usage == null || max == null || max <= 0) return baseBudget;

  const ratio = usage / max;
  if (ratio > 0.9) return 200;
  if (ratio > 0.7) return Math.max(200, Math.floor(baseBudget * (1 - ratio) * 2));
  return baseBudget;
}

/** Handle source=compact: inject cached PreCompact payload (from 3-source merger) */
function handleCompact(sessionId: string): OutputSection[] {
  const state = loadState(sessionId);
  if (!state?.pendingCompactPrime) {
    hookLog('warn', 'session-prime', `No cached compact payload for session ${sessionId}`);
    return [{
      title: 'Context Recovery',
      content: 'Context was compacted. Call `memory_context({ mode: "resume", profile: "resume" })` to recover session state.',
    }];
  }

  const { payload, cachedAt } = state.pendingCompactPrime;
  hookLog('info', 'session-prime', `Injecting cached compact brief (${payload.length} chars, cached at ${cachedAt})`);

  // Clear the pending payload after injection
  updateState(sessionId, { pendingCompactPrime: null });

  const sections: OutputSection[] = [
    { title: 'Recovered Context (Post-Compaction)', content: payload },
    {
      title: 'Recovery Instructions',
      content: 'Context was compacted and auto-recovered via 3-source merge (Memory + Code Graph + CocoIndex). For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
    },
  ];

  // Add last spec folder if known
  if (state.lastSpecFolder) {
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
function handleStartup(sessionId?: string): OutputSection[] {
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

  // Stale code graph index detection
  try {
    if (getStats) {
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

  // Working memory attention signals
  if (sessionId) {
    try {
      const state = loadState(sessionId);
      const workingSet = (state as Record<string, unknown> | null)?.workingSet;
      if (workingSet && Array.isArray(workingSet) && workingSet.length > 0) {
        sections.push({
          title: 'Working Memory',
          content: `Recently active files:\n${workingSet.map((f: unknown) => `- ${String(f)}`).join('\n')}`,
        });
      }
    } catch {
      // No working set data — skip
    }
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
      sections = handleStartup(sessionId);
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
      sections = handleStartup(sessionId);
      budget = SESSION_PRIME_TOKEN_BUDGET;
  }

  // Apply token pressure awareness — reduce budget when context window is filling up
  const adjustedBudget = calculatePressureBudget(input, budget);
  if (adjustedBudget !== budget) {
    hookLog('info', 'session-prime', `Token pressure: budget ${budget} → ${adjustedBudget} (window ${input.context_window_tokens}/${input.context_window_max})`);
  }

  const output = truncateToTokenBudget(formatHookOutput(sections), adjustedBudget);

  // Write to stdout for Claude Code to inject into conversation
  process.stdout.write(output);
  hookLog('info', 'session-prime', `Output ${output.length} chars for source=${source}`);
}

// Run — exit cleanly even on error
main().catch((err: unknown) => {
  hookLog('error', 'session-prime', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
}).finally(() => {
  process.exit(0);
});
