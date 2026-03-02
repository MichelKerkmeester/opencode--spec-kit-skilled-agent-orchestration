// ---------------------------------------------------------------
// MODULE: Retrieval Trace & Context Envelope Contracts
// ---------------------------------------------------------------
// Typed contracts for the retrieval pipeline that enforce end-to-end
// type safety with trace stages and degraded-mode handling.
// C136-08: Foundation for observability and pipeline instrumentation.
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. TYPES
--------------------------------------------------------------- */

/** Pipeline stages in retrieval order */
export type RetrievalStage =
  | 'candidate'
  | 'filter'
  | 'fusion'
  | 'rerank'
  | 'fallback'
  | 'final-rank';

/** A single stage entry in the retrieval trace */
export interface TraceEntry {
  stage: RetrievalStage;
  timestamp: number;
  inputCount: number;
  outputCount: number;
  durationMs: number;
  metadata?: Record<string, unknown>;
}

/** Full retrieval trace capturing all pipeline stages */
export interface RetrievalTrace {
  traceId: string;
  sessionId?: string;
  query: string;
  intent?: string;
  stages: TraceEntry[];
  totalDurationMs: number;
  finalResultCount: number;
}

/** Degraded mode contract — describes how a pipeline failure was handled */
export interface DegradedModeContract {
  failure_mode: string;
  fallback_mode: string;
  /** Confidence impact factor (0 = total loss, 1 = no impact) */
  confidence_impact: number;
  retry_recommendation: 'immediate' | 'delayed' | 'none';
  degradedStages: RetrievalStage[];
}

/** Metadata attached to every context envelope */
export interface EnvelopeMetadata {
  version: string;
  generatedAt: string;
  serverVersion?: string;
}

/** Generic typed context envelope wrapping pipeline results with trace */
export interface ContextEnvelope<T> {
  data: T;
  trace: RetrievalTrace;
  degradedMode?: DegradedModeContract;
  metadata: EnvelopeMetadata;
}

/* ---------------------------------------------------------------
   2. CONSTANTS
--------------------------------------------------------------- */

const ENVELOPE_VERSION = '1.0.0';

/* ---------------------------------------------------------------
   3. FACTORY FUNCTIONS
--------------------------------------------------------------- */

/**
 * Create a new retrieval trace.
 * @param query - The search query string
 * @param sessionId - Optional session identifier
 * @param intent - Optional classified intent
 */
export function createTrace(
  query: string,
  sessionId?: string,
  intent?: string
): RetrievalTrace {
  return {
    traceId: generateTraceId(),
    sessionId,
    query,
    intent,
    stages: [],
    totalDurationMs: 0,
    finalResultCount: 0,
  };
}

/**
 * Add a stage entry to an existing trace (mutates in place for perf).
 * Returns the trace for chaining.
 */
export function addTraceEntry(
  trace: RetrievalTrace,
  stage: RetrievalStage,
  inputCount: number,
  outputCount: number,
  durationMs: number,
  metadata?: Record<string, unknown>
): RetrievalTrace {
  const entry: TraceEntry = {
    stage,
    timestamp: Date.now(),
    inputCount,
    outputCount,
    durationMs,
    metadata,
  };

  trace.stages.push(entry);
  trace.totalDurationMs = trace.stages.reduce((sum, s) => sum + s.durationMs, 0);
  trace.finalResultCount = outputCount;

  return trace;
}

/**
 * Create a context envelope wrapping pipeline results.
 * @param data - The result payload
 * @param trace - The retrieval trace
 * @param degradedMode - Optional degraded mode contract
 * @param serverVersion - Optional server version string
 */
export function createEnvelope<T>(
  data: T,
  trace: RetrievalTrace,
  degradedMode?: DegradedModeContract,
  serverVersion?: string
): ContextEnvelope<T> {
  return {
    data,
    trace,
    degradedMode,
    metadata: {
      version: ENVELOPE_VERSION,
      generatedAt: new Date().toISOString(),
      serverVersion,
    },
  };
}

/**
 * Create a degraded mode contract describing pipeline fallback behavior.
 * Clamps confidence_impact to [0, 1].
 */
export function createDegradedContract(
  failure_mode: string,
  fallback_mode: string,
  confidence_impact: number,
  retry_recommendation: 'immediate' | 'delayed' | 'none',
  degradedStages: RetrievalStage[]
): DegradedModeContract {
  return {
    failure_mode,
    fallback_mode,
    confidence_impact: clampConfidence(confidence_impact),
    retry_recommendation,
    degradedStages,
  };
}

/* ---------------------------------------------------------------
   4. INTERNAL HELPERS
--------------------------------------------------------------- */

/** Generate a unique trace ID (timestamp + random suffix) */
function generateTraceId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `tr_${ts}_${rand}`;
}

/** Clamp a confidence value to [0, 1] */
function clampConfidence(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

/* ---------------------------------------------------------------
   5. EXPORTS
--------------------------------------------------------------- */

// All types and interfaces are exported at declaration site.
// Factory functions are exported at declaration site.
// Re-export ENVELOPE_VERSION for consumers that need version checks.
export { ENVELOPE_VERSION };
