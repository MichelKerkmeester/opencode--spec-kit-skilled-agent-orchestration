#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// MODULE: PreCompact Hook — Compact Inject
// ───────────────────────────────────────────────────────────────
// Runs on Claude Code PreCompact event. Precomputes critical context
// using the 3-source merge pipeline (Memory, Code Graph, CocoIndex)
// and caches to hook state for later injection by SessionStart hook.
// stdout is NOT injected on PreCompact — we only cache here.

import { performance } from 'node:perf_hooks';
import { readFileSync } from 'node:fs';
import {
  parseHookStdin, hookLog, truncateToTokenBudget,
  withTimeout, HOOK_TIMEOUT_MS, COMPACTION_TOKEN_BUDGET, getRequiredSessionId,
} from './shared.js';
import { ensureStateDir, updateState } from './hook-state.js';
import { mergeCompactBrief } from '../../code-graph/lib/compact-merger.js';
import type { MergeInput } from '../../code-graph/lib/compact-merger.js';
import { autoSurfaceAtCompaction } from '../../hooks/memory-surface.js';
import {
  createSharedPayloadEnvelope,
  createPreMergeSelectionMetadata,
  type SharedPayloadEnvelope,
} from '../../lib/context/shared-payload.js';
import {
  CANONICAL_FOLD_VERSION,
  getUnicodeRuntimeFingerprint,
} from '@spec-kit/shared/unicode-normalization';

const COMPACT_FEEDBACK_GUARDS = [
  /^\s*\[SOURCE:\s*hook-cache/i,
  /^\s*\[PROVENANCE:/i,
  /^\s*\[\/SOURCE\]/i,
  /^\s*##\s+Recovered Context/i,
  /^\s*##\s+Recovery Instructions/i,
  /\bauto-recovered\b/i,
];

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

function stripRecoveredCompactLines(lines: string[]): string[] {
  return lines.filter((line) => !COMPACT_FEEDBACK_GUARDS.some((guard) => guard.test(line)));
}

/** Extract most-referenced identifiers from transcript lines (top 10 by frequency) */
function extractAttentionSignals(lines: string[]): string[] {
  const freq = new Map<string, number>();
  // camelCase function calls: e.g. buildMergedContext(
  const funcRe = /\b([a-z][a-zA-Z0-9]{2,})\s*\(/g;
  // PascalCase class/interface names: e.g. MergeInput, OutputSection
  const classRe = /\b([A-Z][a-zA-Z0-9]{2,})\b/g;
  // Common noise words to skip
  const noise = new Set(['Error', 'String', 'Object', 'Array', 'Promise', 'Buffer', 'Date', 'Map', 'Set', 'Number', 'Boolean', 'Function', 'RegExp', 'JSON', 'Math', 'console', 'process', 'undefined', 'null']);
  for (const line of lines) {
    let m: RegExpExecArray | null;
    funcRe.lastIndex = 0;
    while ((m = funcRe.exec(line)) !== null) {
      const id = m[1];
      if (!noise.has(id) && id.length <= 60) {
        freq.set(id, (freq.get(id) ?? 0) + 1);
      }
    }
    classRe.lastIndex = 0;
    while ((m = classRe.exec(line)) !== null) {
      const id = m[1];
      if (!noise.has(id) && id.length <= 60) {
        freq.set(id, (freq.get(id) ?? 0) + 1);
      }
    }
  }
  return [...freq.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([id, count]) => `- ${id} (referenced ${count}x)`);
}

/** Detect active spec folder paths from transcript lines */
function detectSpecFolder(lines: string[]): string | null {
  const specFolderRe = /\.opencode\/specs\/[\w/-]+/g;
  const freq = new Map<string, number>();
  for (const line of lines) {
    const matches = line.match(specFolderRe);
    if (matches) {
      for (const m of matches) {
        // Normalize to folder (strip trailing file component if present)
        const folder = m.replace(/\/[^/]+\.\w+$/, '');
        freq.set(folder, (freq.get(folder) ?? 0) + 1);
      }
    }
  }
  if (freq.size === 0) return null;
  // Return the most-referenced spec folder
  return [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

/** Build compact context from transcript analysis (legacy fallback) */
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

type AutoSurfaceAtCompactionResult = Awaited<ReturnType<typeof autoSurfaceAtCompaction>>;

function renderConstitutionalMemories(
  autoSurfaced: AutoSurfaceAtCompactionResult,
): string {
  const constitutional = autoSurfaced?.constitutional ?? [];
  if (constitutional.length === 0) {
    return '';
  }

  const lines = constitutional.map((memory) => {
    const details: string[] = [`- ${memory.title}`];

    if (memory.retrieval_directive) {
      details.push(`  ${memory.retrieval_directive}`);
    }

    const provenance = [memory.specFolder, memory.filePath].filter(Boolean).join(' | ');
    if (provenance) {
      details.push(`  ${provenance}`);
    }

    return details.join('\n');
  });

  return `## Constitutional Rules\n${lines.join('\n')}`;
}

function renderTriggeredMemories(
  autoSurfaced: AutoSurfaceAtCompactionResult,
): string {
  const triggered = autoSurfaced?.triggered ?? [];
  if (triggered.length === 0) {
    return '';
  }

  const lines = triggered.map((memory) => {
    const matchedPhrases = [...new Set(memory.matched_phrases
      .map((phrase) => phrase.trim())
      .filter((phrase) => phrase.length > 0))];

    if (matchedPhrases.length === 0) {
      return `- ${memory.title}`;
    }

    return `- ${memory.title} (matched: ${matchedPhrases.join(', ')})`;
  });

  return `## Relevant Memories\n${lines.join('\n')}`;
}

/**
 * Build merged context using the 3-source merge pipeline.
 * Extracts session state from transcript, then delegates budget allocation
 * and section rendering to mergeCompactBrief.
 */
async function buildMergedContext(transcriptLines: string[]): Promise<string> {
  const sanitizedLines = stripRecoveredCompactLines(transcriptLines);
  const filePaths = extractFilePaths(sanitizedLines);
  const topics = extractTopics(sanitizedLines);

  // Build codeGraph input: active files + structural hints
  const codeGraphParts: string[] = [];
  if (filePaths.length > 0) {
    codeGraphParts.push('Active files:\n' + filePaths.map(p => `- ${p}`).join('\n'));
  }
  const codeGraph = codeGraphParts.join('\n\n');

  // Build cocoIndex input: semantic neighbor hint for post-recovery
  const cocoIndex = filePaths.length > 0
    ? 'Use `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.'
    : '';

  // Build sessionState input: recent context + topics + attention signals
  const sessionParts: string[] = [];

  // Spec folder detection
  const specFolder = detectSpecFolder(sanitizedLines);
  if (specFolder) {
    sessionParts.push(`Active spec folder: ${specFolder}`);
  }

  // Working memory attention signals
  const attentionSignals = extractAttentionSignals(sanitizedLines);
  if (attentionSignals.length > 0) {
    sessionParts.push('Working memory attention:\n' + attentionSignals.join('\n'));
  }

  if (topics.length > 0) {
    sessionParts.push('Recent topics:\n' + topics.map(t => `- ${t}`).join('\n'));
  }
  const meaningfulLines = sanitizedLines
    .filter(l => l.trim().length > 10 && !l.startsWith('{'))
    .slice(-5);
  if (meaningfulLines.length > 0) {
    sessionParts.push('Recent context:\n' + meaningfulLines.join('\n'));
  }
  const sessionState = sessionParts.join('\n\n');

  const selection = createPreMergeSelectionMetadata({
    selectedFrom: ['transcript-tail', 'active-files', 'recent-topics', 'attention-signals'],
    fileCount: filePaths.length,
    topicCount: topics.length,
    attentionSignalCount: attentionSignals.length,
    notes: [
      sanitizedLines.length !== transcriptLines.length
        ? 'Recovered compact transcript lines were removed before pre-merge selection.'
        : 'No recovered compact transcript lines detected in the current tail.',
      specFolder ? `Spec folder anchored: ${specFolder}` : 'No active spec folder detected in transcript tail.',
    ],
    antiFeedbackGuards: [
      'Strip recovered hook-cache source markers before transcript summarization.',
      'Do not reuse Recovery Instructions text as session-state evidence.',
      'Build pre-merge candidates before section assembly.',
    ],
  });

  const mergeInput: MergeInput = {
    constitutional: '',   // Constitutional rules come from Memory MCP, not available in hooks
    codeGraph,
    cocoIndex,
    triggered: '',        // Triggered memories not available in hooks
    sessionState,
  };

  // Merge with timing
  const t0 = performance.now();
  const merged = mergeCompactBrief(mergeInput, COMPACTION_TOKEN_BUDGET, undefined, selection);
  const elapsed = performance.now() - t0;

  if (elapsed > 1500) {
    hookLog('warn', 'compact-inject', `Merge pipeline took ${elapsed.toFixed(0)}ms (budget: ${HOOK_TIMEOUT_MS}ms)`);
  } else {
    hookLog('info', 'compact-inject', `Merge pipeline completed in ${elapsed.toFixed(0)}ms (${merged.metadata.sourceCount} sections, ~${merged.metadata.totalTokenEstimate} tokens)`);
  }

  const autoSurfaced = await autoSurfaceAtCompaction(sessionState);
  if (!autoSurfaced) {
    return merged.text;
  }

  hookLog(
    'info',
    'compact-inject',
    `Compaction auto-surface returned ${autoSurfaced.constitutional.length} constitutional and ${autoSurfaced.triggered.length} triggered memories (${autoSurfaced.latencyMs}ms)`,
  );

  const constitutionalSection = renderConstitutionalMemories(autoSurfaced);
  const triggeredSection = renderTriggeredMemories(autoSurfaced);
  const surfacedSections = [constitutionalSection, triggeredSection]
    .filter((section) => section.length > 0);

  if (surfacedSections.length === 0) {
    return merged.text;
  }

  const surfacedContext = surfacedSections.join('\n\n');

  return merged.text
    ? `${surfacedContext}\n\n${merged.text}`
    : surfacedContext;
}

async function buildMergedPayloadContract(transcriptLines: string[]): Promise<SharedPayloadEnvelope> {
  const sanitizedLines = stripRecoveredCompactLines(transcriptLines);
  const filePaths = extractFilePaths(sanitizedLines);
  const topics = extractTopics(sanitizedLines);
  const attentionSignals = extractAttentionSignals(sanitizedLines);
  const sessionParts: string[] = [];
  const specFolder = detectSpecFolder(sanitizedLines);
  if (specFolder) {
    sessionParts.push(`Active spec folder: ${specFolder}`);
  }
  if (attentionSignals.length > 0) {
    sessionParts.push('Working memory attention:\n' + attentionSignals.join('\n'));
  }
  if (topics.length > 0) {
    sessionParts.push('Recent topics:\n' + topics.map((topic) => `- ${topic}`).join('\n'));
  }
  const meaningfulLines = sanitizedLines.filter((line) => line.trim().length > 10 && !line.startsWith('{')).slice(-5);
  if (meaningfulLines.length > 0) {
    sessionParts.push('Recent context:\n' + meaningfulLines.join('\n'));
  }

  const selection = createPreMergeSelectionMetadata({
    selectedFrom: ['transcript-tail', 'active-files', 'recent-topics', 'attention-signals'],
    fileCount: filePaths.length,
    topicCount: topics.length,
    attentionSignalCount: attentionSignals.length,
    notes: [
      sanitizedLines.length !== transcriptLines.length
        ? 'Recovered compact transcript lines were removed before pre-merge selection.'
        : 'No recovered compact transcript lines detected in the current tail.',
      specFolder ? `Spec folder anchored: ${specFolder}` : 'No active spec folder detected in transcript tail.',
    ],
    antiFeedbackGuards: [
      'Strip recovered hook-cache source markers before transcript summarization.',
      'Do not reuse Recovery Instructions text as session-state evidence.',
      'Build pre-merge candidates before section assembly.',
    ],
  });

  const mergeInput: MergeInput = {
    constitutional: '',
    codeGraph: filePaths.length > 0 ? 'Active files:\n' + filePaths.map((filePath) => `- ${filePath}`).join('\n') : '',
    cocoIndex: filePaths.length > 0
      ? 'Use `mcp__cocoindex_code__search` to find semantic neighbors of active files listed above.'
      : '',
    triggered: '',
    sessionState: sessionParts.join('\n\n'),
  };

  return mergeCompactBrief(mergeInput, COMPACTION_TOKEN_BUDGET, undefined, selection).payloadContract;
}

async function main(): Promise<void> {
  ensureStateDir();

  const input = await withTimeout(parseHookStdin(), HOOK_TIMEOUT_MS, null);
  if (!input) {
    hookLog('warn', 'compact-inject', 'No stdin input received');
    return;
  }

  const sessionId = getRequiredSessionId(input.session_id, 'compact-inject');
  hookLog('info', 'compact-inject', `PreCompact triggered for session ${sessionId} (trigger: ${input.trigger ?? 'unknown'})`);

  let transcriptLines: string[] = [];
  if (input.transcript_path) {
    transcriptLines = tailFile(input.transcript_path, 50);
    hookLog('info', 'compact-inject', `Read ${transcriptLines.length} transcript lines`);
  }

  // Use the 3-source merge pipeline, falling back to legacy on error
  let payload: string;
  try {
    const mergedContext = await buildMergedContext(transcriptLines);
    payload = truncateToTokenBudget(mergedContext, COMPACTION_TOKEN_BUDGET);
    const payloadContract = await buildMergedPayloadContract(transcriptLines);
    const timestamp = new Date().toISOString();
    const updateResult = updateState(sessionId, {
      pendingCompactPrime: {
        payload,
        cachedAt: timestamp,
        payloadContract: {
          ...payloadContract,
          provenance: {
            ...payloadContract.provenance,
            producer: 'hook_cache',
            sourceSurface: 'compact-cache',
            trustState: 'cached',
            sanitizerVersion: CANONICAL_FOLD_VERSION,
            runtimeFingerprint: getUnicodeRuntimeFingerprint(),
          },
        },
      },
    });
    if (!updateResult.persisted) {
      hookLog('warn', 'compact-inject', `Compact context cache was not persisted for session ${sessionId}`);
      return;
    }
    hookLog('info', 'compact-inject', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
    return;
  } catch (err: unknown) {
    hookLog('warn', 'compact-inject', `Merge pipeline failed, falling back to legacy: ${err instanceof Error ? err.message : String(err)}`);
    const rawContext = buildCompactContext(transcriptLines);
    payload = truncateToTokenBudget(rawContext, COMPACTION_TOKEN_BUDGET);
  }

  const timestamp = new Date().toISOString();
  const updateResult = updateState(sessionId, {
    pendingCompactPrime: {
      payload,
      cachedAt: timestamp,
      payloadContract: createSharedPayloadEnvelope({
        kind: 'compaction',
        sections: [{
          key: 'legacy-compact-context',
          title: 'Legacy Compact Context',
          content: payload,
          source: 'session',
        }],
        summary: 'Legacy compaction cache assembled after merge fallback',
        provenance: {
          producer: 'hook_cache',
          sourceSurface: 'compact-cache',
          trustState: 'cached',
          generatedAt: timestamp,
          lastUpdated: null,
          sourceRefs: ['compact-inject', 'hook-state'],
          sanitizerVersion: CANONICAL_FOLD_VERSION,
          runtimeFingerprint: getUnicodeRuntimeFingerprint(),
        },
      }),
    },
  });
  if (!updateResult.persisted) {
    hookLog('warn', 'compact-inject', `Legacy compact context cache was not persisted for session ${sessionId}`);
    return;
  }

  hookLog('info', 'compact-inject', `Cached compact context (${payload.length} chars) for session ${sessionId}`);
}

// Run — exit cleanly even on error (hooks must never block Claude)
main().catch((err: unknown) => {
  hookLog('error', 'compact-inject', `Unhandled error: ${err instanceof Error ? err.message : String(err)}`);
}).finally(() => {
  process.exit(0);
});
