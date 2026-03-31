// ───────────────────────────────────────────────────────────────
// MODULE: Compact Merger
// ───────────────────────────────────────────────────────────────
// Merges context from multiple sources (Memory, Code Graph, CocoIndex, Session)
// into a unified compact brief for compaction injection.

import { allocateBudget, createDefaultSources, type AllocationResult } from './budget-allocator.js';

/** Input from each context source */
export interface MergeInput {
  constitutional: string;    // Constitutional rules (from Memory)
  codeGraph: string;         // Structural context (from Code Graph)
  cocoIndex: string;         // Semantic neighbors (from CocoIndex)
  triggered: string;         // Triggered memories (from Memory)
  sessionState: string;      // Active task / next steps
}

/** Per-source freshness metadata */
export interface SourceFreshness {
  source: string;
  lastUpdated: string | null;
  staleness: 'fresh' | 'recent' | 'stale' | 'unknown';
}

/** Merged compact brief with metadata */
export interface MergedBrief {
  text: string;
  sections: {
    name: string;
    content: string;
    tokenEstimate: number;
    source: string;
  }[];
  allocation: AllocationResult;
  metadata: {
    totalTokenEstimate: number;
    sourceCount: number;
    mergedAt: string;
    mergeDurationMs: number;
    deduplicatedFiles: number;
    freshness: SourceFreshness[];
  };
}

/** Estimate tokens from string (4 chars ≈ 1 token) */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/** Truncate text to fit within a token budget */
function truncateToTokens(text: string, maxTokens: number): string {
  if (maxTokens <= 0) return '';
  if (estimateTokens(text) <= maxTokens) return text;

  const marker = '\n[...truncated]';
  const maxChars = maxTokens * 4;
  if (marker.length >= maxChars) {
    return text.slice(0, maxChars);
  }

  const contentChars = Math.max(0, maxChars - marker.length);
  return text.slice(0, contentChars) + marker;
}

/** Extract file paths from a text section for deduplication */
function extractFilePathsFromText(text: string): Set<string> {
  const paths = new Set<string>();
  const pathRegex = /(?:\/[\w.-]+){2,}(?:\.\w+)/g;
  const matches = text.match(pathRegex);
  if (matches) matches.forEach(m => paths.add(m));
  return paths;
}

/** Deduplicate file references across sections — higher priority sources keep their mentions */
function deduplicateFilePaths(sections: MergedBrief['sections']): number {
  const seenFiles = new Set<string>();
  let removedCount = 0;

  for (const section of sections) {
    const filePaths = extractFilePathsFromText(section.content);
    const duplicates: string[] = [];

    for (const fp of filePaths) {
      if (seenFiles.has(fp)) {
        duplicates.push(fp);
        removedCount++;
      } else {
        seenFiles.add(fp);
      }
    }

    // Remove duplicate file path lines from lower-priority sections
    if (duplicates.length > 0) {
      let content = section.content;
      for (const dup of duplicates) {
        const lineRegex = new RegExp(`^.*${dup.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*$\n?`, 'gm');
        content = content.replace(lineRegex, '');
      }
      section.content = content.trim();
      section.tokenEstimate = estimateTokens(section.content);
    }
  }
  return removedCount;
}

/**
 * Merge context from multiple sources into a compact brief.
 *
 * Strategy:
 * 1. Allocate budget across sources (floor + overflow)
 * 2. Truncate each source to its granted budget
 * 3. Deduplicate at file level (same file from multiple sources → keep highest priority)
 * 4. Render sections in priority order with headers
 */
export function mergeCompactBrief(
  input: MergeInput,
  totalBudget: number = 4000,
  freshness?: SourceFreshness[],
): MergedBrief {
  const startTime = performance.now();

  const constitutionalSize = estimateTokens(input.constitutional);
  const codeGraphSize = estimateTokens(input.codeGraph);
  const cocoIndexSize = estimateTokens(input.cocoIndex);
  const triggeredSize = estimateTokens(input.triggered);
  const sessionStateSize = estimateTokens(input.sessionState);

  const sources = createDefaultSources(
    constitutionalSize,
    codeGraphSize,
    cocoIndexSize,
    triggeredSize,
    sessionStateSize,
  );
  const allocation = allocateBudget(sources, totalBudget);

  // Build sections with granted budgets
  const sections: MergedBrief['sections'] = [];
  const allocationMap = new Map(allocation.allocations.map(a => [a.name, a]));
  const pushSection = (
    inputText: string,
    allocationName: string,
    sectionName: string,
    source: string,
  ): void => {
    if (!inputText.trim()) return;

    const granted = allocationMap.get(allocationName)?.granted ?? 0;
    if (granted <= 0) return;

    const content = truncateToTokens(inputText, granted);
    if (!content.trim()) return;

    sections.push({
      name: sectionName,
      content,
      tokenEstimate: estimateTokens(content),
      source,
    });
  };

  pushSection(input.constitutional, 'constitutional', 'Constitutional Rules', 'memory');
  pushSection(input.codeGraph, 'codeGraph', 'Active Files & Structural Context', 'code-graph');
  pushSection(input.cocoIndex, 'cocoIndex', 'Semantic Neighbors', 'cocoindex');
  pushSection(input.sessionState, 'sessionState', 'Session State / Next Steps', 'session');
  pushSection(input.triggered, 'triggered', 'Triggered Memories', 'memory');

  // File-level deduplication across sections
  const deduplicatedFiles = deduplicateFilePaths(sections);

  // Render final text
  const text = sections
    .map(s => `## ${s.name}\n${s.content}`)
    .join('\n\n');

  const totalTokenEstimate = sections.reduce((sum, s) => sum + s.tokenEstimate, 0);
  const mergeDurationMs = Math.round(performance.now() - startTime);

  return {
    text,
    sections,
    allocation,
    metadata: {
      totalTokenEstimate,
      sourceCount: sections.length,
      mergedAt: new Date().toISOString(),
      mergeDurationMs,
      deduplicatedFiles,
      freshness: freshness ?? [
        { source: 'constitutional', lastUpdated: null, staleness: 'unknown' },
        { source: 'codeGraph', lastUpdated: null, staleness: 'unknown' },
        { source: 'cocoIndex', lastUpdated: null, staleness: 'unknown' },
        { source: 'triggered', lastUpdated: null, staleness: 'unknown' },
      ],
    },
  };
}
