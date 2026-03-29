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
import { ALLOWED_BASE_PATHS, checkDatabaseUpdated } from '../core/index.js';
import { toErrorMessage } from '../utils/index.js';
import { createFilePathValidator } from '../utils/validators.js';

// Formatters
import { calculateTokenMetrics, type TokenMetrics } from '../formatters/index.js';

// Lib modules
import * as triggerMatcher from '../lib/parsing/trigger-matcher.js';
import * as workingMemory from '../lib/cognitive/working-memory.js';
import * as attentionDecay from '../lib/cognitive/attention-decay.js';
import * as tierClassifier from '../lib/cognitive/tier-classifier.js';
import type { TierInput, StateStats } from '../lib/cognitive/tier-classifier.js';
import * as coActivation from '../lib/cognitive/co-activation.js';

// REQ-019: Standardized Response Structure
import { createMCPSuccessResponse, createMCPEmptyResponse, createMCPErrorResponse } from '../lib/response/envelope.js';
// T004: Consumption instrumentation
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger.js';

// Eval logger — fail-safe, no-op when SPECKIT_EVAL_LOGGING !== "true"
import { logSearchQuery, logFinalResult } from '../lib/eval/eval-logger.js';

// Shared handler types
import type { MCPResponse } from './types.js';
// C2 FIX: Import DB access for scope filtering
import { initialize_db } from '../lib/search/vector-index-store.js';
// T73: Import session manager for trusted session validation (IDOR prevention)
import * as sessionManager from '../lib/session/session-manager.js';

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
  specFolder?: string;
  limit?: number;
  session_id?: string;
  turnNumber?: number;
  include_cognitive?: boolean;
  // C2 FIX: Scope fields to prevent cross-scope trigger leaks
  tenantId?: string;
  userId?: string;
  agentId?: string;
  sharedSpaceId?: string;
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
  const {
    prompt,
    limit: rawLimit = 3,
    session_id: rawSessionId,
    turnNumber: rawTurnNumber = 1,
    include_cognitive: includeCognitive = true
  } = args;

  // Validate inputs before any I/O (checkDatabaseUpdated is deferred until after validation)
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

  // T73 SECURITY: Validate caller-supplied sessionId through server-side session
  // manager to prevent IDOR. Callers cannot read/write working memory for
  // arbitrary sessions — only server-minted or previously tracked sessions.
  let sessionId: string | undefined = rawSessionId;
  if (rawSessionId) {
    const trustedSession = sessionManager.resolveTrustedSession(rawSessionId, {
      tenantId: args.tenantId,
      userId: args.userId,
      agentId: args.agentId,
    });
    if (trustedSession.error) {
      console.warn(`[memory_match_triggers] SECURITY: Rejected untrusted sessionId "${rawSessionId}" — ${trustedSession.error}`);
      return createMCPErrorResponse({
        tool: 'memory_match_triggers',
        error: trustedSession.error,
        code: 'E_SESSION_SCOPE',
        details: { requestedSessionId: rawSessionId },
        recovery: {
          hint: 'Omit session_id to start a new server-generated session, or reuse the effectiveSessionId returned by memory_context.',
        },
      });
    }
    sessionId = trustedSession.effectiveSessionId;
  }

  const limit = (typeof rawLimit === 'number' && Number.isFinite(rawLimit) && rawLimit > 0)
    ? Math.min(Math.floor(rawLimit), 50)
    : 3;
  const turnNumber = (typeof rawTurnNumber === 'number' && Number.isFinite(rawTurnNumber) && rawTurnNumber >= 0)
    ? Math.floor(rawTurnNumber)
    : 1;

  await checkDatabaseUpdated();

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
  let results: TriggerMatch[] = triggerMatchResult.matches;

  // C2 FIX: Post-filter by scope to prevent cross-tenant trigger leaks
  const { specFolder, tenantId, userId, agentId, sharedSpaceId } = args;
  if (specFolder || tenantId || userId || agentId || sharedSpaceId) {
    try {
      const database = initialize_db();
      const memoryIds = results.map(r => r.memoryId);
      if (memoryIds.length > 0) {
        const placeholders = memoryIds.map(() => '?').join(',');
        const scopeRows = database.prepare(`
          SELECT id, spec_folder, tenant_id, user_id, agent_id, shared_space_id
          FROM memory_index WHERE id IN (${placeholders})
        `).all(...memoryIds) as Array<{
          id: number;
          spec_folder?: string;
          tenant_id?: string;
          user_id?: string;
          agent_id?: string;
          shared_space_id?: string;
        }>;
        const scopeMap = new Map(scopeRows.map(r => [r.id, r]));
        results = results.filter(match => {
          const row = scopeMap.get(match.memoryId);
          if (!row) return false;
          // H2 FIX: Require exact scope match — rows with NULL scope are excluded
          // when the caller specifies a scope, not silently passed through.
          if (specFolder && row.spec_folder !== specFolder) return false;
          if (tenantId && row.tenant_id !== tenantId) return false;
          if (userId && row.user_id !== userId) return false;
          if (agentId && row.agent_id !== agentId) return false;
          if (sharedSpaceId && row.shared_space_id !== sharedSpaceId) return false;
          return true;
        });
      }
    } catch (scopeErr: unknown) {
      console.error('[memory_match_triggers] Scope filtering failed, returning empty results (fail-closed):', toErrorMessage(scopeErr));
      results = [];
    }
  }
  const detectedSignals = Array.isArray(triggerMatchResult.stats?.signals)
    ? triggerMatchResult.stats.signals
    : [];
  const degradedTriggerMatching = triggerMatchResult.stats?.degraded ?? null;

  if (!results || results.length === 0) {
    const noMatchResponse = createMCPEmptyResponse({
      tool: 'memory_match_triggers',
      summary: 'No matching trigger phrases found',
      data: {
        matchType: useCognitive ? 'trigger-phrase-cognitive' : 'trigger-phrase',
        degradedMatching: degradedTriggerMatching,
        cognitive: useCognitive ? {
          enabled: true,
          sessionId,
          turnNumber: turnNumber,
          decayApplied: decayStats ? decayStats.decayedCount : 0
        } : null
      },
      hints: [
        'Ensure memories have trigger phrases defined',
        'Try a different prompt or check memory content',
        ...(degradedTriggerMatching ? ['Trigger matching ran in degraded mode; inspect server logs for skipped trigger sources'] : []),
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

        if (wmEntry) {
          // WM already applies its own decay — skip turnDecayFactor to avoid double-decay.
          effectiveRetrievability = Math.min(effectiveRetrievability, wmEntry.attentionScore);
        } else {
          effectiveRetrievability *= turnDecayFactor;
        }

        attentionScore = effectiveRetrievability;
        tier = tierClassifier.classifyState(effectiveRetrievability);
      } else {
        // When no FSRS record, use WM score directly (already session-decayed) or apply turn decay
        const baseScore = wmEntry ? wmEntry.attentionScore : 1.0;
        attentionScore = wmEntry ? baseScore : baseScore * turnDecayFactor;
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
      degradedMatching: degradedTriggerMatching,
      cognitive: cognitiveStats
    },
    hints,
    startTime: startTime,
    extraMeta: {
      latencyMs: latencyMs,
      triggerSignals: detectedSignals,
      ...(degradedTriggerMatching ? { degradedMatching: degradedTriggerMatching } : {}),
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
