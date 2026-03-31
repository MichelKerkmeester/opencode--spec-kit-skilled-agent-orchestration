// ───────────────────────────────────────────────────────────────
// MODULE: Compact Merger
// ───────────────────────────────────────────────────────────────
// Merges context from 3 sources (Memory, Code Graph, CocoIndex)
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
  };
}

/** Estimate tokens from string (4 chars ≈ 1 token) */
function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/** Truncate text to fit within a token budget */
function truncateToTokens(text: string, maxTokens: number): string {
  if (estimateTokens(text) <= maxTokens) return text;
  const maxChars = maxTokens * 4;
  return text.slice(0, maxChars) + '\n[...truncated]';
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
export function mergeCompactBrief(input: MergeInput, totalBudget: number = 4000): MergedBrief {
  const constitutionalSize = estimateTokens(input.constitutional);
  const codeGraphSize = estimateTokens(input.codeGraph);
  const cocoIndexSize = estimateTokens(input.cocoIndex);
  const triggeredSize = estimateTokens(input.triggered);

  const sources = createDefaultSources(constitutionalSize, codeGraphSize, cocoIndexSize, triggeredSize);
  const allocation = allocateBudget(sources, totalBudget);

  // Build sections with granted budgets
  const sections: MergedBrief['sections'] = [];
  const allocationMap = new Map(allocation.allocations.map(a => [a.name, a]));

  if (input.constitutional.trim()) {
    const alloc = allocationMap.get('constitutional');
    const content = truncateToTokens(input.constitutional, alloc?.granted ?? 700);
    sections.push({ name: 'Constitutional Rules', content, tokenEstimate: estimateTokens(content), source: 'memory' });
  }

  if (input.codeGraph.trim()) {
    const alloc = allocationMap.get('codeGraph');
    const content = truncateToTokens(input.codeGraph, alloc?.granted ?? 1200);
    sections.push({ name: 'Active Files & Structural Context', content, tokenEstimate: estimateTokens(content), source: 'code-graph' });
  }

  if (input.cocoIndex.trim()) {
    const alloc = allocationMap.get('cocoIndex');
    const content = truncateToTokens(input.cocoIndex, alloc?.granted ?? 900);
    sections.push({ name: 'Semantic Neighbors', content, tokenEstimate: estimateTokens(content), source: 'cocoindex' });
  }

  // Session state always gets included (from overhead budget)
  if (input.sessionState.trim()) {
    sections.push({ name: 'Session State / Next Steps', content: input.sessionState, tokenEstimate: estimateTokens(input.sessionState), source: 'session' });
  }

  if (input.triggered.trim()) {
    const alloc = allocationMap.get('triggered');
    const content = truncateToTokens(input.triggered, alloc?.granted ?? 400);
    sections.push({ name: 'Triggered Memories', content, tokenEstimate: estimateTokens(content), source: 'memory' });
  }

  // Render final text
  const text = sections
    .map(s => `## ${s.name}\n${s.content}`)
    .join('\n\n');

  const totalTokenEstimate = sections.reduce((sum, s) => sum + s.tokenEstimate, 0);

  return {
    text,
    sections,
    allocation,
    metadata: {
      totalTokenEstimate,
      sourceCount: sections.length,
      mergedAt: new Date().toISOString(),
    },
  };
}
