// ───────────────────────────────────────────────────────────────
// MODULE: Passive Context Enrichment Pipeline
// ───────────────────────────────────────────────────────────────
// F057: Implements Phase 020 Part 3 — runPassiveEnrichment().
//
// Enriches tool responses with:
//   1. Code graph symbols near any file paths mentioned in the response
//   2. Session continuity warning if quality score is degraded/critical
//
// Hard guards:
//   - 250ms latency budget (aborts if exceeded)
//   - 200 token max for injected content
//   - Recursion guard (no enrichment of enrichment)

import { estimateTokenCount } from '@spec-kit/shared/utils/token-estimate';

/* ───────────────────────────────────────────────────────────────
   1. TYPES
──────────────────────────────────────────────────────────────── */

export interface EnrichmentResult {
  /** Enrichment hints appended to the response */
  hints: string[];
  /** Total estimated tokens added */
  tokenCount: number;
  /** Wall-clock time spent enriching */
  latencyMs: number;
  /** Whether enrichment was skipped */
  skipped: boolean;
  skipReason?: string;
}

interface EnrichmentOptions {
  /** Max wall-clock time in ms (default: 250) */
  deadlineMs?: number;
  /** Max tokens to inject (default: 200) */
  tokenBudget?: number;
}

/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS & STATE
──────────────────────────────────────────────────────────────── */

const DEFAULT_DEADLINE_MS = 250;
const DEFAULT_TOKEN_BUDGET = 200;

/** Recursion guard — prevents enrichment of enrichment */
let enrichmentInProgress = false;

/** Pattern to detect file paths in response text */
const FILE_PATH_PATTERN = /(?:^|\s|['"`])((?:\.\/|\/)?[\w.-]+\/[\w.-]+\.\w{1,8})/g;

/* ───────────────────────────────────────────────────────────────
   3. ENRICHERS
──────────────────────────────────────────────────────────────── */

/**
 * Extract file paths mentioned in the response text.
 * Returns up to 5 unique paths to keep enrichment bounded.
 */
function extractMentionedPaths(text: string): string[] {
  const matches = new Set<string>();
  let match: RegExpExecArray | null;
  FILE_PATH_PATTERN.lastIndex = 0;
  while ((match = FILE_PATH_PATTERN.exec(text)) !== null) {
    matches.add(match[1]);
    if (matches.size >= 5) break;
  }
  return [...matches];
}

/**
 * Enrich with code graph symbols near mentioned files.
 * Dynamically imports code-graph-db to avoid hard dependency.
 */
async function enrichWithCodeGraphSymbols(
  paths: string[],
  tokenBudget: number,
): Promise<string[]> {
  if (paths.length === 0) return [];

  try {
    const graphDb = await import('../code-graph/code-graph-db.js');
    const db = graphDb.getDb();
    if (!db) return [];

    // Look up symbols in the mentioned files (top 3 per file, max 10 total)
    const symbols: string[] = [];
    for (const filePath of paths.slice(0, 3)) {
      const rows = db.prepare(`
        SELECT name, kind FROM code_nodes
        WHERE file_path LIKE ? OR file_path LIKE ?
        ORDER BY kind ASC, name ASC
        LIMIT 3
      `).all(`%${filePath}`, `%${filePath.replace(/^\.\//, '')}`) as Array<{ name: string; kind: string }>;

      for (const row of rows) {
        symbols.push(`${row.kind}:${row.name}`);
        if (symbols.length >= 10) break;
      }
      if (symbols.length >= 10) break;
    }

    if (symbols.length === 0) return [];

    const hint = `[code-graph] Symbols near mentioned files: ${symbols.join(', ')}`;
    if (estimateTokenCount(hint) > tokenBudget) {
      // Trim to fit budget
      const trimmed = `[code-graph] ${symbols.slice(0, 5).join(', ')}`;
      return estimateTokenCount(trimmed) <= tokenBudget ? [trimmed] : [];
    }
    return [hint];
  } catch {
    // Code graph not available — non-fatal
    return [];
  }
}

/**
 * Enrich with session continuity warning if quality is degraded.
 * Dynamically imports context-metrics to avoid circular deps.
 */
async function enrichWithSessionWarning(): Promise<string[]> {
  try {
    const { computeQualityScore } = await import('../session/context-metrics.js');
    const quality = computeQualityScore();

    if (quality.level === 'critical') {
      return ['[session] Context quality is CRITICAL. Consider running `memory_context({ mode: "resume" })` or `session_health` to diagnose.'];
    }
    if (quality.level === 'degraded') {
      return ['[session] Context quality is degraded. Session may benefit from a `session_resume` call.'];
    }
    return [];
  } catch {
    return [];
  }
}

/* ───────────────────────────────────────────────────────────────
   4. PIPELINE
──────────────────────────────────────────────────────────────── */

/**
 * Run the passive enrichment pipeline on a tool response.
 *
 * @param responseText - The stringified tool response to enrich
 * @param options      - Deadline and token budget overrides
 * @returns EnrichmentResult with hints and metadata
 */
export async function runPassiveEnrichment(
  responseText: string,
  options?: EnrichmentOptions,
): Promise<EnrichmentResult> {
  const startTime = Date.now();
  const deadlineMs = options?.deadlineMs ?? DEFAULT_DEADLINE_MS;
  const tokenBudget = options?.tokenBudget ?? DEFAULT_TOKEN_BUDGET;

  // Recursion guard
  if (enrichmentInProgress) {
    return { hints: [], tokenCount: 0, latencyMs: 0, skipped: true, skipReason: 'recursion_guard' };
  }

  enrichmentInProgress = true;
  try {
    const hints: string[] = [];
    let tokensUsed = 0;

    // Step 1: Code graph symbol enrichment
    if (Date.now() - startTime < deadlineMs) {
      const paths = extractMentionedPaths(responseText);
      const graphHints = await enrichWithCodeGraphSymbols(paths, tokenBudget - tokensUsed);
      for (const hint of graphHints) {
        const cost = estimateTokenCount(hint);
        if (tokensUsed + cost > tokenBudget) break;
        hints.push(hint);
        tokensUsed += cost;
      }
    }

    // Step 2: Session continuity warning
    if (Date.now() - startTime < deadlineMs && tokensUsed < tokenBudget) {
      const sessionHints = await enrichWithSessionWarning();
      for (const hint of sessionHints) {
        const cost = estimateTokenCount(hint);
        if (tokensUsed + cost > tokenBudget) break;
        hints.push(hint);
        tokensUsed += cost;
      }
    }

    const latencyMs = Date.now() - startTime;

    // Deadline exceeded warning (non-fatal — still return what we have)
    if (latencyMs > deadlineMs) {
      console.warn(`[passive-enrichment] Exceeded deadline: ${latencyMs}ms > ${deadlineMs}ms`);
    }

    return { hints, tokenCount: tokensUsed, latencyMs, skipped: false };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn(`[passive-enrichment] Pipeline error (non-fatal): ${message}`);
    return {
      hints: [],
      tokenCount: 0,
      latencyMs: Date.now() - startTime,
      skipped: true,
      skipReason: `error: ${message}`,
    };
  } finally {
    enrichmentInProgress = false;
  }
}

/**
 * Extract mentioned file paths from text (exported for testing).
 */
export { extractMentionedPaths };
