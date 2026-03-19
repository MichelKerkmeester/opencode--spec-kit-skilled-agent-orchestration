// ───────────────────────────────────────────────────────────────
// MODULE: Memory Triggers
// ───────────────────────────────────────────────────────────────
// Shared packages
import { validateFilePath } from '@spec-kit/shared/utils/path-security';

// Feature catalog: Trigger phrase matching (memory_match_triggers)
// Feature catalog: BM25 trigger phrase re-index gate


/* ───────────────────────────────────────────────────────────────
   1. DEPENDENCIES
──────────────────────────────────────────────────────────────── */

// Core utilities
import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core';
import { toErrorMessage } from '../utils';
import { createFilePathValidator } from '../utils/validators';

// Formatters
import { calculateTokenMetrics, type TokenMetrics } from '../formatters';

// Lib modules
import * as triggerMatcher from '../lib/parsing/trigger-matcher';
import * as workingMemory from '../lib/cognitive/working-memory';
import * as attentionDecay from '../lib/cognitive/attention-decay';
import * as tierClassifier from '../lib/cognitive/tier-classifier';
import type { TierInput, StateStats } from '../lib/cognitive/tier-classifier';
import * as coActivation from '../lib/cognitive/co-activation';

// REQ-019: Standardized Response Structure
import { createMCPSuccessResponse, createMCPEmptyResponse, createMCPErrorResponse } from '../lib/response/envelope';
// T004: Consumption instrumentation
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger';

// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logFinalResult } from '../lib/eval/eval-logger';

// Shared handler types
import type { MCPResponse } from './types';

/* ───────────────────────────────────────────────────────────────
   2. TYPES
──────────────────────────────────────────────────────────────── */

interface TriggerMatch {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  matchedPhrases: string[];
  importanceWeight: number;
  [key: string]: unknown;
}

interface EnrichedTriggerMatch extends TriggerMatch {
  attentionScore: number;
  tier: string;
  coActivated: boolean;
}

interface FormattedResult {
  memoryId: number;
  specFolder: string;
  filePath: string;
  title: string | null;
  matchedPhrases: string[];
  importanceWeight: number;
  tier?: string;
  attentionScore?: number;
  content?: string;
  coActivated?: boolean;
  [key: string]: unknown;
}

interface DecayStats {
  decayedCount: number;
}

interface CoActivatedMemory {
  memoryId: number;
}

interface WorkingMemoryEntry {
  memoryId: number;
  attentionScore: number;
}

interface CognitiveStats {
  enabled: boolean;
  sessionId: string;
  turnNumber: number;
  decayApplied: number;
  memoriesActivated: number;
  coActivations: number;
  tierDistribution: StateStats;
  tokenMetrics: TokenMetrics;
}

interface TriggerArgs {
  prompt: string;
  limit?: number;
  session_id?: string;
  turnNumber?: number;
  include_cognitive?: boolean;
}

/* ───────────────────────────────────────────────────────────────
   2b. CONSTANTS
──────────────────────────────────────────────────────────────── */

/** Per-turn decay rate for attention scoring. */
const TURN_DECAY_RATE = 0.98;
const validateTieredFilePath = createFilePathValidator(ALLOWED_BASE_PATHS, validateFilePath);

/* ───────────────────────────────────────────────────────────────
   2c. HELPER FUNCTIONS
──────────────────────────────────────────────────────────────── */

/** Fetch full memory records required for FSRS tier classification. */
function fetchMemoryRecords(memoryIds: number[]): Map<number, TierInput> {
  const records = new Map<number, TierInput>();
  if (memoryIds.length === 0) return records;

  const db = attentionDecay.getDb();
  if (!db) return records;

  try {
    const stmt = db.prepare(
      'SELECT * FROM memory_index WHERE id = ?'
    );
    for (const id of memoryIds) {
      const row = stmt.get(id) as TierInput | undefined;
      if (row) {
        records.set(row.id as number, row);
      }
    }
  } catch (err: unknown) {
    const message = toErrorMessage(err);
    console.warn('[memory_match_triggers] Failed to fetch memory records:', message);
  }

  return records;
}

/** Get tiered content for a memory based on its tier state (HOT=full, WARM=summary, COLD=excluded) */
async function getTieredContent(
  memoryInfo: { filePath: string; title: string | null; triggerPhrases: string[] },
  tier: string
): Promise<string> {
  if (tier === 'COLD' || tier === 'DORMANT' || tier === 'ARCHIVED') return '';
  try {
    const fs = await import('fs');
    const validatedPath = validateTieredFilePath(memoryInfo.filePath);
    const canonicalPath = validateTieredFilePath(fs.realpathSync(validatedPath));
    const content = fs.readFileSync(canonicalPath, 'utf-8');
    if (tier === 'HOT') return content;
    // WARM tier returns truncated summary
    return content.substring(0, 150) + (content.length > 150 ? '...' : '');
  } catch (_error: unknown) {
    console.warn('[memory-triggers] getTieredContent failed', {
      filePath: memoryInfo.filePath, // server-side only; safe to log
      tier,
      error: _error instanceof Error ? _error.message : String(_error),
    });
    return '';
  }
}

/* ───────────────────────────────────────────────────────────────
   3. MATCH TRIGGERS HANDLER
──────────────────────────────────────────────────────────────── */

/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
async function handleMemoryMatchTriggers(args: TriggerArgs): Promise<MCPResponse> {
  await checkDatabaseUpdated();

  const {
    prompt,
    limit: rawLimit = 3,
    session_id: sessionId,
    turnNumber: rawTurnNumber = 1,
    include_cognitive: includeCognitive = true
  } = args;

  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
    ? Math.min(Math.floor(rawLimit), 50)
    : 3;
  const turnNumber = (typeof rawTurnNumber === 'number' && Number.isFinite(rawTurnNumber) && rawTurnNumber >= 0)
    ? Math.floor(rawTurnNumber)
    : 1;

  if (!prompt || typeof prompt !== 'string') {
    return createMCPErrorResponse({
      tool: 'memory_match_triggers',
      error: 'prompt is required and must be a string',
      code: 'E_VALIDATION',
      details: { parameter: 'prompt' },
      recovery: {
        hint: 'Provide a non-empty string for the prompt parameter'
      }
    });
  }

  const startTime = Date.now();

  // Eval logger — capture trigger query at entry (fail-safe)
  let _evalQueryId = 0;
  let _evalRunId = 0;
  try {
    const evalEntry = logSearchQuery({
      query: prompt,
      intent: 'trigger_match',
      specFolder: null,
    });
    _evalQueryId = evalEntry.queryId;
    _evalRunId = evalEntry.evalRunId;
  } catch (_error: unknown) { /* eval logging must never break triggers handler */ }

  const logFinalTriggerEval = (memoryIds: number[], latencyMs: number): void => {
    try {
      if (_evalRunId && _evalQueryId) {
        logFinalResult({
          evalRunId: _evalRunId,
          queryId: _evalQueryId,
          resultMemoryIds: memoryIds,
          scores: memoryIds.map(() => 1.0), // trigger matches are binary
          fusionMethod: 'trigger',
          latencyMs,
        });
      }
    } catch (_error: unknown) {
      /* eval logging must never break triggers handler */
    }
  };

  const useCognitive = includeCognitive &&
    sessionId &&
    workingMemory.isEnabled() &&
    attentionDecay.getDb();

  let decayStats: DecayStats | null = null;
  if (useCognitive) {
    try {
      decayStats = { decayedCount: workingMemory.batchUpdateScores(sessionId as string) };
    } catch (err: unknown) {
      const message = toErrorMessage(err);
      console.warn('[memory_match_triggers] Decay failed:', message);
    }
  }

  const triggerMatchResult = triggerMatcher.matchTriggerPhrasesWithStats(prompt, limit * 2);
  const results: TriggerMatch[] = triggerMatchResult.matches;
  const detectedSignals = Array.isArray(triggerMatchResult.stats?.signals)
    ? triggerMatchResult.stats.signals
    : [];

  if (!results || results.length === 0) {
    const noMatchResponse = createMCPEmptyResponse({
      tool: 'memory_match_triggers',
      summary: 'No matching trigger phrases found',
      data: {
        matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
        cognitive: useCognitive ? {
          enabled: true,
          sessionId,
          turnNumber: turnNumber,
          decayApplied: decayStats ? decayStats.decayedCount : 0
        } : null
      },
      hints: [
        'Ensure memories have trigger phrases defined',
        'Try a different prompt or check memory content'
      ],
      startTime: startTime
    });

    logFinalTriggerEval([], Date.now() - startTime);
    return noMatchResponse;
  }

  let formattedResults: FormattedResult[];
  let cognitiveStats: CognitiveStats | null = null;

  if (useCognitive) {
    // Step 3: ACTIVATE (T209)
    const activatedMemories: number[] = [];
    for (const match of results) {
      try {
        attentionDecay.activateMemory(match.memoryId);
        // T209: Persist max attention boost for matched memories.
        workingMemory.setAttentionScore(sessionId as string, match.memoryId, 1.0);
        activatedMemories.push(match.memoryId);
      } catch (err: unknown) {
        const message = toErrorMessage(err);
        console.warn(`[memory_match_triggers] Failed to activate memory ${match.memoryId}:`, message);
      }
    }

    // Step 4: CO-ACTIVATE
    const coActivatedMemories: CoActivatedMemory[] = [];
    if (coActivation.isEnabled()) {
      for (const memoryId of activatedMemories) {
        try {
          const boosted: CoActivatedMemory[] | null = coActivation.spreadActivation([memoryId])
            .map(r => ({ memoryId: r.id }));
          if (boosted && Array.isArray(boosted)) {
            coActivatedMemories.push(...boosted);
          }
        } catch (err: unknown) {
          const message = toErrorMessage(err);
          console.warn(`[memory_match_triggers] Co-activation failed for ${memoryId}:`, message);
        }
      }
    }

    const matchedIds = results.map((m: TriggerMatch) => m.memoryId);
    const fullRecords = fetchMemoryRecords(matchedIds);

    const sessionMemories: WorkingMemoryEntry[] = workingMemory.getSessionMemories(sessionId as string)
      .map(wm => ({ memoryId: (wm.id as number) || 0, attentionScore: (wm.attention_score as number) || 1.0 }));

    const turnDecayFactor = turnNumber > 1
      ? Math.pow(TURN_DECAY_RATE, turnNumber - 1)
      : 1.0;

    const enrichedResults: EnrichedTriggerMatch[] = results.map((match: TriggerMatch) => {
      const fullRecord = fullRecords.get(match.memoryId);
      const wmEntry = sessionMemories.find(wm => wm.memoryId === match.memoryId);

      let attentionScore: number;
      let tier: string;

      if (fullRecord) {
        const classification = tierClassifier.classifyTier(fullRecord);
        let effectiveRetrievability = classification.retrievability;

        effectiveRetrievability *= turnDecayFactor;

        if (wmEntry) {
          // WM already applies its own decay.
          // Multiplying by turnDecayFactor again causes double-decay.
          effectiveRetrievability = Math.min(effectiveRetrievability, wmEntry.attentionScore);
        }

        attentionScore = effectiveRetrievability;
        tier = tierClassifier.classifyState(effectiveRetrievability);
      } else {
        const baseScore = wmEntry ? wmEntry.attentionScore : 1.0;
        attentionScore = baseScore * turnDecayFactor;
        tier = tierClassifier.classifyState(attentionScore);
      }

      // Clamp to [0,1] — retrievability * decay or wmEntry scores
      // Can drift outside the valid range due to floating-point arithmetic.
      attentionScore = Math.max(0, Math.min(1, attentionScore));

      return {
        ...match,
        attentionScore: attentionScore,
        tier,
        coActivated: coActivatedMemories.some(ca => ca.memoryId === match.memoryId)
      };
    });

    const tieredResults = tierClassifier.filterAndLimitByState(enrichedResults, null, limit);

    formattedResults = await Promise.all(tieredResults.map(async (r: EnrichedTriggerMatch) => {
      const content: string = await getTieredContent({
        filePath: r.filePath,
        title: r.title,
        triggerPhrases: r.matchedPhrases
      }, r.tier);

      return {
        memoryId: r.memoryId,
        specFolder: r.specFolder,
        filePath: r.filePath,
        title: r.title,
        matchedPhrases: r.matchedPhrases,
        importanceWeight: r.importanceWeight,
        tier: r.tier,
        attentionScore: r.attentionScore,
        content: content,
        coActivated: r.coActivated || false
      };
    }));

    cognitiveStats = {
      enabled: true,
      sessionId: sessionId!,
      turnNumber: turnNumber,
      decayApplied: decayStats ? decayStats.decayedCount : 0,
      memoriesActivated: activatedMemories.length,
      coActivations: coActivatedMemories.length,
      tierDistribution: tierClassifier.getStateStats(enrichedResults),
      tokenMetrics: calculateTokenMetrics(results, formattedResults)
    };

  } else {
    formattedResults = results.slice(0, limit).map((r: TriggerMatch) => ({
      memoryId: r.memoryId,
      specFolder: r.specFolder,
      filePath: r.filePath,
      title: r.title,
      matchedPhrases: r.matchedPhrases,
      importanceWeight: r.importanceWeight
    }));
  }

  const latencyMs = Date.now() - startTime;
  if (latencyMs > 100) {
    console.warn(`[memory_match_triggers] Latency ${latencyMs}ms exceeds 100ms target`);
  }

  const summary = useCognitive
    ? `Matched ${formattedResults.length} memories with cognitive features`
    : `Matched ${formattedResults.length} memories via trigger phrases`;

  const hints: string[] = [];
  if (!useCognitive && sessionId) {
    hints.push('Enable cognitive features with include_cognitive: true');
  }
  const coldCount = cognitiveStats?.tierDistribution?.COLD;
  if (coldCount !== undefined && coldCount > 0) {
    hints.push(`${coldCount} COLD-tier memories excluded for token efficiency`);
  }
  if (detectedSignals.length > 0) {
    hints.push(`Signal vocabulary applied (${detectedSignals.length} category matches)`);
  }

  const _triggersResponse = createMCPSuccessResponse({
    tool: 'memory_match_triggers',
    summary,
    data: {
      matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
      count: formattedResults.length,
      results: formattedResults,
      cognitive: cognitiveStats
    },
    hints,
    startTime: startTime,
    extraMeta: {
      latencyMs: latencyMs,
      triggerSignals: detectedSignals,
    }
  });

  // Consumption instrumentation — log triggers event (fail-safe, never throws)
  try {
    const db = attentionDecay.getDb();
    if (db) {
      initConsumptionLog(db);
      const resultIds = formattedResults.map(r => r.memoryId).filter(id => typeof id === 'number');
      logConsumptionEvent(db, {
        event_type: 'triggers',
        query_text: prompt,
        result_count: formattedResults.length,
        result_ids: resultIds,
        session_id: sessionId ?? null,
        latency_ms: latencyMs,
      });
    }
  } catch (_error: unknown) { /* instrumentation must never cause triggers handler to fail */ }

  // Eval logger — capture final trigger results at exit (fail-safe)
  const triggerMemoryIds = formattedResults.map(r => r.memoryId).filter(id => typeof id === 'number');
  logFinalTriggerEval(triggerMemoryIds, latencyMs);

  return _triggersResponse;
}

/* ───────────────────────────────────────────────────────────────
   4. EXPORTS
──────────────────────────────────────────────────────────────── */

export {
  handleMemoryMatchTriggers,
};

// Backward-compatible aliases (snake_case)
const handle_memory_match_triggers = handleMemoryMatchTriggers;

export {
  handle_memory_match_triggers,
};
