#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: Gemini PreCompress Hook — Compact Cache
// ───────────────────────────────────────────────────────────────
// Runs on Gemini CLI PreCompress event. Reads transcript, extracts
// context, and caches it to hook state for later injection by the
// BeforeAgent compact-inject hook.
//
// Gemini stdin: { session_id, transcript_path, cwd, hook_event_name,
//                 timestamp, trigger: "manual"|"auto" }

import { readFileSync } from 'node:fs';
import {
  hookLog, truncateToTokenBudget,
  withTimeout, HOOK_TIMEOUT_MS, COMPACTION_TOKEN_BUDGET,
} from '../claude/shared.js';
import { ensureStateDir, updateState } from '../claude/hook-state.js';
import { parseGeminiStdin } from './shared.js';

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

/** Detect active spec folder from transcript lines */
function detectSpecFolder(lines: string[]): string | null {
  const specFolderRe = /\.opencode\/specs\/[\w/-]+/g;
  const freq = new Map<string, number>();
  for (const line of lines) {
    const matches = line.match(specFolderRe);
    if (matches) {
      for (const m of matches) {
        const folder = m.replace(/\/[^/]+\.\w+$/, '');
        freq.set(folder, (freq.get(folder) ?? 0) + 1);
      }
    }
  }
  if (freq.size === 0) return null;
  return [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

/** Build compact context from transcript analysis */
function buildCompactContext(transcriptLines: string[]): string {
  const filePaths = extractFilePaths(transcriptLines);
  const topics = extractTopics(transcriptLines);
  const sections: string[] = [];

  const specFolder = detectSpecFolder(transcriptLines);
  if (specFolder) {
    sections.push(`## Active Spec Folder\n${specFolder}`);
  }

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

  return sections.join('\n\n');
}

async function main(): Promise<void> {
  ensureStateDir();

  const input = await withTimeout(parseGeminiStdin(), HOOK_TIMEOUT_MS, null);
  if (!input) {
    hookLog('warn', 'gemini:compact-cache', 'No stdin input received');
    return;
  }

  const sessionId = input.session_id ?? 'unknown';
  hookLog('info', 'gemini:compact-cache', `PreCompress triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);

  let transcriptLines: string[] = [];
  if (input.transcript_path) {
    transcriptLines = tailFile(input.transcript_path, 50);
    hookLog('info', 'gemini:compact-cache', `Read ${transcriptLines.length} transcript lines`);
  }

  const rawContext = buildCompactContext(transcriptLines);
  const payload = truncateToTokenBudget(rawContext, COMPACTION_TOKEN_BUDGET);

  updateState(sessionId, {
    pendingCompactPrime: {
      payload,
      cachedAt: new Date().toISOString(),
    },
  });

  hookLog('info', 'gemini:compact-cache', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
}

// Run — exit cleanly even on error
main().catch((err: unknown) => {
  hookLog('error', 'gemini:compact-cache', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
}).finally(() => {
  process.exit(0);
});
