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
  type OutputSection,
} from './shared.js';
import { ensureStateDir, loadState, updateState } from './hook-state.js';

/** Handle source=compact: inject cached PreCompact payload */
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
  hookLog('info', 'session-prime', `Injecting cached compact context (${payload.length} chars, cached at ${cachedAt})`);

  // Clear the pending payload after injection
  updateState(sessionId, { pendingCompactPrime: null });

  return [
    { title: 'Recovered Context (Post-Compaction)', content: payload },
    {
      title: 'Recovery Instructions',
      content: 'Context was compacted and auto-recovered. For full session state, call `memory_context({ mode: "resume", profile: "resume" })`.',
    },
  ];
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
  return [
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

  const output = truncateToTokenBudget(formatHookOutput(sections), budget);

  // Write to stdout for Claude Code to inject into conversation
  process.stdout.write(output);
  hookLog('info', 'session-prime', `Output ${output.length} chars for source=${source}`);
}

// Run — exit cleanly even on error
main().catch((err) => {
  hookLog('error', 'session-prime', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
}).finally(() => {
  process.exit(0);
});
