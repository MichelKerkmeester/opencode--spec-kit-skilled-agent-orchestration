#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: PreCompact Hook — Compact Inject
// ───────────────────────────────────────────────────────────────
// Runs on Claude Code PreCompact event. Precomputes critical context
// and caches to hook state for later injection by SessionStart hook.
// stdout is NOT injected on PreCompact — we only cache here.

import { readFileSync } from 'node:fs';
import {
  parseHookStdin, hookLog, truncateToTokenBudget,
  withTimeout, HOOK_TIMEOUT_MS, COMPACTION_TOKEN_BUDGET,
} from './shared.js';
import { ensureStateDir, updateState } from './hook-state.js';

/** Extract the last N lines from a file */
function tailFile(filePath: string, lines: number): string[] {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const allLines = content.split('\n');
    return allLines.slice(Math.max(0, allLines.length - lines));
  } catch {
    return [];
  }
}

/** Extract file paths mentioned in transcript lines */
function extractFilePaths(lines: string[]): string[] {
  const pathRegex = /(?:\/[\w.-]+){2,}(?:\.\w+)/g;
  const paths = new Set<string>();
  for (const line of lines) {
    const matches = line.match(pathRegex);
    if (matches) {
      for (const m of matches) paths.add(m);
    }
  }
  return [...paths].slice(0, 20);
}

/** Extract topics from recent transcript content */
function extractTopics(lines: string[]): string[] {
  const topics = new Set<string>();
  for (const line of lines) {
    const specMatch = line.match(/specs\/[\w-]+/g);
    if (specMatch) specMatch.forEach(m => topics.add(m));
    const toolMatch = line.match(/memory_\w+|code_graph_\w+|task_\w+/g);
    if (toolMatch) toolMatch.forEach(m => topics.add(m));
  }
  return [...topics].slice(0, 10);
}

/** Build compact context from transcript analysis */
function buildCompactContext(transcriptLines: string[]): string {
  const filePaths = extractFilePaths(transcriptLines);
  const topics = extractTopics(transcriptLines);
  const sections: string[] = [];

  if (filePaths.length > 0) {
    sections.push('## Active Files\n' + filePaths.map(p => `- ${p}`).join('\n'));
  }
  if (topics.length > 0) {
    sections.push('## Recent Topics\n' + topics.map(t => `- ${t}`).join('\n'));
  }

  const meaningfulLines = transcriptLines
    .filter(l => l.trim().length > 10 && !l.startsWith('{'))
    .slice(-5);
  if (meaningfulLines.length > 0) {
    sections.push('## Recent Context\n' + meaningfulLines.join('\n'));
  }

  // Hint for AI to use CocoIndex for semantic neighbors after recovery
  if (filePaths.length > 0) {
    sections.push('## Semantic Context (CocoIndex)\nUse `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.');
  }

  return sections.join('\n\n');
}

async function main(): Promise<void> {
  ensureStateDir();

  const input = await withTimeout(parseHookStdin(), HOOK_TIMEOUT_MS, null);
  if (!input) {
    hookLog('warn', 'compact-inject', 'No stdin input received');
    return;
  }

  const sessionId = input.session_id ?? 'unknown';
  hookLog('info', 'compact-inject', `PreCompact triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);

  let transcriptLines: string[] = [];
  if (input.transcript_path) {
    transcriptLines = tailFile(input.transcript_path, 50);
    hookLog('info', 'compact-inject', `Read ${transcriptLines.length} transcript lines`);
  }

  const rawContext = buildCompactContext(transcriptLines);
  const payload = truncateToTokenBudget(rawContext, COMPACTION_TOKEN_BUDGET);

  updateState(sessionId, {
    pendingCompactPrime: {
      payload,
      cachedAt: new Date().toISOString(),
    },
  });

  hookLog('info', 'compact-inject', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
}

// Run — exit cleanly even on error (hooks must never block Claude)
main().catch((err) => {
  hookLog('error', 'compact-inject', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
}).finally(() => {
  process.exit(0);
});
